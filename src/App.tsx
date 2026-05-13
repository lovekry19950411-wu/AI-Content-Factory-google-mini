import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Sparkles, FolderOpen, Video, Heart, Briefcase, Zap, Loader2, ArrowRight, Trophy } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';

// 你的建築商身份代碼 (由 base:app_id 生成)
const BUILDERCODEHEX = '0x626173653a6170705f69643a363966376661653136333632326266386365393638363433';
const X402_URL = 'https://x402.bankr.bot/0xc97785f7eeabaffde32436842ad4824cb4141f8b/viral-gen';

type Tab = 'overview' | 'trends' | 'generate' | 'library';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [library, setLibrary] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // 進入 App 時加載排行榜
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await (window as any).bankr.appKV.get('viral_leaderboard');
        if (data) setLeaderboard(data);
      } catch (e) { console.error('加載排行榜失敗', e); }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex justify-center bg-black min-h-screen">
      <div className="w-full max-w-md bg-[#0A0A0A] flex flex-col h-screen overflow-hidden shadow-2xl relative border-x border-white/5">
        
        {/* Header */}
        <header className="pt-12 pb-4 px-6 bg-[#0A0A0A] border-b border-white/5 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {activeTab === 'overview' && '總覽'}
            {activeTab === 'trends' && <><Trophy className="text-yellow-500" size={20} /> 爆款榜</>}
            {activeTab === 'generate' && '生成'}
            {activeTab === 'library' && '內容庫'}
          </h1>
          <WalletStatus />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'trends' && <TrendsTab leaderboard={leaderboard} />}
          {activeTab === 'generate' && <GenerateTab setLibrary={setLibrary} setActiveTab={setActiveTab} />}
          {activeTab === 'library' && <LibraryTab library={library} />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full h-20 bg-[#121212] border-t border-white/5 flex justify-around items-center px-2 pb-4 z-20 rounded-t-3xl">
          <NavItem icon={<Home />} label="總覽" id="overview" active={activeTab} set={setActiveTab} />
          <NavItem icon={<TrendingUp />} label="爆款榜" id="trends" active={activeTab} set={setActiveTab} />
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
    <button onClick={() => set(id)} className={flex flex-col items-center gap-1.5 p-2 transition-colors ${isActive ? 'text-[#0052FF]' : 'text-gray-500'}}>
      {React.cloneElement(icon, { size: 22 })}
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
      <button onClick={() => disconnect()} className="text-xs bg-white/5 px-3 py-1.5 rounded-full text-white/70">
        {address.slice(0,6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })} className="text-xs bg-[#0052FF] px-3 py-1.5 rounded-full text-white font-bold">
      連接錢包
    </button>
  );
}

function OverviewTab() {
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();

  const handleSubscribe = () => {
    sendTransaction({
      to: '0xc97785f7eeabaffde32436842ad4824cb4141f8b', // 你的錢包
      data: BUILDERCODEHEX as 0x${string},
      value: 0n
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-[#0052FF]/30 bg-gradient-to-br from-[#0052FF]/10 to-transparent">
        <h3 className="font-bold text-lg mb-2 text-white">Base 創作者憑證</h3>
        <p className="text-xs text-gray-400 mb-6">點擊下方按鈕在 Base 鏈上激活你的建築商身份，解鎖 Pro 權限。</p>
        <button onClick={handleSubscribe} disabled={isPending} className="w-full bg-[#0052FF] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          {isPending ? '激活中...' : '立即激活身份'} <ArrowRight size={16} />
        </button>
        {isSuccess && <p className="text-xs text-green-400 mt-3 text-center">✅ 身份激活成功！</p>}
      </div>
    </div>
  );
}

function TrendsTab({ leaderboard }: any) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-500">全網爆款生成趨勢</h3>
      {leaderboard.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm">暫無數據，快去生成第一個爆款！</div>
      ) : (
        leaderboard.map((item: any, i: number) => (
          <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4">
            <span className="text-lg font-black text-white/20">#{i+1}</span>
            <div className="flex-1">
              <div className="text-white font-bold">{item.topic}</div>
              <div className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
            <Zap size={16} className="text-yellow-500" />
          </div>
        ))
      )}
    </div>
  );
}

function GenerateTab({ setLibrary, setActiveTab }: any) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('video_script');
  const [platform, setPlatform] = useState('tiktok');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      // 調用 x402 付費接口：支付 0.2 USDC
      const response = await (window as any).bankr.x402.fetch(X402_URL, {
        method: 'POST',
        body: JSON.stringify({ type, platform, topic, appId: '69f7fae163622bf8ce968643' }),
        maxPaymentUsd: 0.25
      });

      if (!response.ok) throw new Error('支付失敗');

      const { content } = response.body;
      
      setLibrary((prev: any) => [{
        id: Math.random().toString(36).substring(7),
        topic, type, platform, content,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      setActiveTab('library');
      setTopic('');
    } catch (e) {
      alert('生成失敗：請確保錢包有足夠的 USDC 並完成簽名。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500">你想生成什麼主題？</label>
        <input 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：职场断舍离、失落後重拾自信..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0052FF] outline-none"
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading || !topic}
        className="w-full bg-white text-black py-4 rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Zap size={18} fill="black" /> 支付 0.2 USDC 生成爆款</>}
      </button>
      <p className="text-[10px] text-center text-gray-500">支付成功後將自動跳轉至內容庫</p>
    </div>
  );
}

function LibraryTab({ library }: any) {
  return (
    <div className="p-6 space-y-4">
      {library.length === 0 ? (
        <div className="text-center py-20 text-gray-600">你的內容庫空空如也</div>
      ) : (
        library.map((item) => (
          <div key={item.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] bg-[#0052FF]/20 text-[#0052FF] px-2 py-0.5 rounded">{item.platform}</span>
              <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <h4 className="font-bold text-white">{item.topic}</h4>
            <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap bg-black/30 p-3 rounded-lg">
              {item.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
