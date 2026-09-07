import React, { useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Volume2, Zap, Trash2, Info, Check, ShieldAlert } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, toggleSound, toggleReducedMotion } = useSettingsStore();
  const { resetAllProgress } = useProgressStore();

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    await resetAllProgress();
    setConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <section className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="app-header">
        <Header title="Cài đặt hệ thống" />
      </div>

      <div className="app-scroll flex-1 min-h-0">
        <PageContainer maxWidth="md" className="pb-24 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Trải nghiệm người dùng</h3>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30"><Volume2 className="w-5 h-5" /></div>
                <div>
                  <span className="font-semibold text-white text-sm block">Hiệu ứng âm thanh</span>
                  <span className="text-xs text-slate-400">Phát âm phản hồi khi chạm và hoàn thành</span>
                </div>
              </div>
              <button type="button" onClick={toggleSound} aria-label="Chuyển đổi âm thanh" className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30"><Zap className="w-5 h-5" /></div>
                <div>
                  <span className="font-semibold text-white text-sm block">Giảm hiệu ứng chuyển động</span>
                  <span className="text-xs text-slate-400">Tối ưu phản xạ tối đa cho màn hình tốc độ cao</span>
                </div>
              </div>
              <button type="button" onClick={toggleReducedMotion} aria-label="Chuyển đổi hiệu ứng chuyển động" className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.reducedMotion ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-rose-900/40 rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="font-display font-bold text-sm text-rose-400 uppercase tracking-wider flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Vùng dữ liệu</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Toàn bộ dữ liệu luyện tập, mức độ thành thạo và kỷ lục thời gian được lưu trữ cục bộ trên thiết bị của bạn qua IndexedDB.</p>

            {resetSuccess && <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-400 text-xs flex items-center gap-2"><Check className="w-4 h-4" /> Đã đặt lại dữ liệu thành công!</div>}

            {!confirmReset ? (
              <Button variant="danger" size="md" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setConfirmReset(true)}>Đặt lại toàn bộ tiến độ</Button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-3">
                <p className="text-xs font-semibold text-rose-300">Bạn có chắc chắn muốn xóa toàn bộ lịch sử luyện tập và điểm kỷ lục? Thao tác này không thể hoàn tác.</p>
                <div className="flex items-center gap-3">
                  <Button variant="danger" size="sm" onClick={handleReset}>Xác nhận xóa</Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Hủy bỏ</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
            <div className="inline-flex items-center gap-1 text-xs text-indigo-400 font-bold uppercase font-mono"><Info className="w-3.5 h-3.5" /> AIO Memory Platform</div>
            <p className="text-[11px] text-slate-500 font-mono">Phiên bản 1.0.0 (MVP) • Universal Engine Architecture</p>
          </div>
        </PageContainer>
      </div>
    </section>
  );
};
