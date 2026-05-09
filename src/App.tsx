import React, { useState } from 'react';
import { Home, TrendingUp, Sparkles, FolderOpen, Video, Heart, Briefcase, Zap, Loader2, ArrowRight } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { generateViralContent, GeneratedContent, Platform } from './services/geminiService';
import { BUILDER_CODE_HEX } from './constants/builderCode';

type Tab = 'overview' | 'trends' | 'generate' | 'library';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [library, setLibrary] = useState<GeneratedContent[]>([]);

  return (
    <div className="flex justify-center bg-black min-h-screen">
      <div className="w-full max-w-md bg-bg-deep flex flex-col h-screen overflow-hidden shadow-2xl relative border-x border-border-dim">
        
        {/* Header */}
        <header className="pt-12 pb-4 px-6 bg-bg-deep border-b border-border-dim sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {activeTab === 'overview' && '總覽'}
            {activeTab === 'trends' && '熱點'}
            {activeTab === 'generate' && '生成'}
            {activeTab === 'library' && '內容庫'}
          </h1>
          <WalletStatus />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'trends' && <TrendsTab />}
          {activeTab === 'generate' && <GenerateTab setLibrary={setLibrary} setActiveTab={setActiveTab} />}
          {activeTab === 'library' && <LibraryTab library={library} />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full h-20 bg-[#121212] border-t border-border-dim flex justify-around items-center px-2 pb-4 z-20 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <NavItem icon={<Home />} label="總覽" id="overview" active={activeTab} set={setActiveTab} />
          <NavItem icon={<TrendingUp />} label="熱點" id="trends" active={activeTab} set={setActiveTab} />
          <NavItem icon={<Sparkles />} label="生成" id="generate" active={activeTab} set={setActiveTab} />
          <NavItem icon={<FolderOpen />} label="內容庫" id="library" active={activeTab} set={setActiveTab} />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ icon, label, id, active, set }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)} 
      className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${isActive ? 'text-brand' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {React.cloneElement(icon, { size: 22, className: isActive ? 'fill-brand/20' : '' })}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button onClick={() => disconnect()} className="text-xs bg-white/10 px-3 py-1.5 rounded-full text-white/70 hover:bg-white/20">
        {address.slice(0,6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })} className="text-xs bg-brand px-3 py-1.5 rounded-full text-white font-bold hover:bg-brand-hover">
      連接錢包
    </button>
  );
}

function OverviewTab() {
  const { isConnected, address } = useAccount();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();

  const handleSubscribe = () => {
    if (!isConnected) return alert('請先連接 Base 網絡錢包');
    sendTransaction({
      to: '0x0000000000000000000000000000000000000000', // Example address
      value: 0n,
      data: BUILDER_CODE_HEX as `0x${string}`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {['今日生成', '總內容數', '熱點話題'].map((t, i) => (
          <div key={t} className="glass-panel p-4 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-brand pb-1">8</span>
            <span className="text-[10px] text-gray-400">{t}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-brand/20 to-transparent border-brand/30">
        <h3 className="font-bold text-lg mb-2">開通 Base Pro 會員</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">解鎖無限次數 AI 影片生成與高階配音，支持 Base 鏈上智能合約交易。(包含開發者身份憑證綁定)</p>
        <button 
          onClick={handleSubscribe} 
          disabled={isPending}
          className="brand-button w-full"
        >
          {isPending ? '交易打包中...' : '立即上鏈訂閱'}
          <ArrowRight size={16} />
        </button>
        {isSuccess && <p className="text-xs text-green-400 mt-3 text-center">✅ 交易成功！歡迎來到 Pro 模式</p>}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">內容分佈</h3>
          <span className="text-brand text-xs">查看全部</span>
        </div>
        <div className="glass-panel p-5 space-y-4">
           {[
             { name: '情感共鳴', count: 3, color: 'bg-pink-500' },
             { name: '成功學', count: 2, color: 'bg-yellow-500' },
             { name: '短視頻腳本', count: 3, color: 'bg-brand' },
           ].map(item => (
             <div key={item.name} className="flex justify-between items-center text-sm">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${item.color}`} />
                 <span className="text-gray-300">{item.name}</span>
               </div>
               <span className="text-brand">{item.count}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function TrendsTab() {
  const trends = [
    { title: '职场断舍离', tags: ['#职场', '#心理健康'], score: 88, desc: '随着职场竞争加剧，许多人开始关注如何调整自己的...' },
    { title: '失落后如何重拾自信', tags: ['#自信', '#励志'], score: 88, desc: '分享个人故事与重拾自信的心得，鼓励观众客服低谷...' },
    { title: '断亲式社交正在流行', tags: ['#社交', '#年轻人'], score: 94, desc: '"断亲式关系内耗"成为高频词，年轻人越来越重视...' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="px-4 py-1.5 rounded-full bg-brand text-white text-xs font-bold whitespace-nowrap">全部</span>
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs whitespace-nowrap">抖音</span>
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs whitespace-nowrap">小红书</span>
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs whitespace-nowrap">B站</span>
      </div>

      <div className="space-y-4">
        {trends.map((t, i) => (
          <div key={i} className="glass-panel p-5 space-y-4 relative overflow-hidden group">
            <div className="flex gap-2">
              <span className="text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20">多平台</span>
              <span className="text-[10px] text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">情感/职场</span>
            </div>
            <h3 className="font-bold text-lg">{t.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${t.score}%` }}></div>
              </div>
              <span className="text-xs text-gray-500 font-mono">{t.score}</span>
            </div>
            <div className="flex gap-2 font-mono text-xs text-gray-500">
               {t.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenerateTab({ setLibrary, setActiveTab }: any) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('video_script');
  const [platform, setPlatform] = useState<Platform>('tiktok');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const content = await generateViralContent(type as any, platform, topic);
      setLibrary((prev: any) => [{
        id: Math.random().toString(36).substring(7),
        topic,
        type,
        platform,
        content,
        timestamp: new Date().toISOString()
      }, ...prev]);
      setActiveTab('library');
      setTopic('');
    } catch (e) {
      console.error(e);
      alert('Generation failed. Ensure GEMINI_API_KEY is set in your environment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3">選擇內容類型</h3>
        <div className="grid grid-cols-2 gap-3">
          <TypeCard active={type === 'video_script'} onClick={() => setType('video_script')} icon={<Video />} title="短視頻腳本" desc="抖音/快手60秒爆款腳本" />
          <TypeCard active={type === 'visual_prompt'} onClick={() => setType('visual_prompt')} icon={<Sparkles />} title="漫畫分鏡" desc="動漫/條漫分鏡創作" />
          <TypeCard active={type === 'voiceover_text'} onClick={() => setType('voiceover_text')} icon={<TrendingUp />} title="成功學文案" desc="勵志爆款激勵文案" />
          <TypeCard active={type === 'subtitle_gen'} onClick={() => setType('subtitle_gen')} icon={<Heart />} title="情感共鳴" desc="高轉發情感文案" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3">發佈平台</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['tiktok', 'xiaohongshu', 'weibo', 'bilibili', 'wechat'].map((p) => (
             <button 
                key={p} 
                onClick={() => setPlatform(p as Platform)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${platform === p ? 'bg-brand text-white shadow-[0_0_15px_rgba(229,57,53,0.3)]' : 'bg-bg-sidebar border border-border-dim text-gray-400 hover:text-white'}`}
             >
               {p === 'tiktok' ? '抖音' : p === 'xiaohongshu' ? '小紅書' : p === 'bilibili' ? 'B站' : p === 'wechat' ? '微信' : '微博'}
             </button>
           ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3">話題 / 關鍵詞</h3>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例：月入3萬的副業秘訣、失戀後如何重新出發..."
          className="w-full bg-bg-sidebar border border-border-dim rounded-xl p-4 text-sm outline-none focus:border-brand/40 min-h-[100px] resize-none"
        />
      </div>

      <button onClick={handleGenerate} disabled={loading || !topic} className="brand-button w-full py-4 text-lg mt-8 shadow-2xl disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" /> : <Zap />}
        立即生成
      </button>
    </div>
  );
}

function TypeCard({ active, onClick, icon, title, desc }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${active ? 'bg-brand text-white border-brand' : 'bg-bg-sidebar text-gray-400 border-border-dim hover:border-brand/50 hover:text-white'}`}
    >
      <div className="mb-3">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className={`text-[10px] leading-tight ${active ? 'text-white/80' : 'text-gray-500'}`}>{desc}</p>
    </div>
  );
}

function LibraryTab({ library }: { library: GeneratedContent[] }) {
  if (library.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 space-y-4">
        <FolderOpen size={48} className="opacity-20" />
        <p className="text-sm">內容庫空空如也，快去生成第一篇爆款內容吧！</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {library.map((item) => (
        <div key={item.id} className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20 uppercase tracking-widest">{item.type.replace('_', ' ')}</span>
            <span className="flex items-center gap-1 text-[10px] text-yellow-500"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> 就緒</span>
          </div>
          <h4 className="font-bold text-base leading-tight">{item.topic}</h4>
          <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{item.content}</p>
          <div className="flex justify-between items-center pt-3 border-t border-border-dim/50 mt-2">
            <span className="text-[10px] text-gray-500 font-mono">{item.content.length} 字 • {item.platform}</span>
            <div className="flex gap-3">
               <button className="text-gray-500 hover:text-white transition-colors"><FolderOpen size={14} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
