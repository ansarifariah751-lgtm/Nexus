import { useState } from 'react';
import {
  Shield, Eye, EyeOff, Smartphone, Check,
  AlertTriangle, Lock, Key, CheckCircle
} from 'lucide-react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(newPassword);

  const strengthLabel = () => {
    if (strength === 0) return { label: '', color: '' };
    if (strength <= 1) return { label: 'Very Weak', color: 'text-red-600' };
    if (strength === 2) return { label: 'Weak', color: 'text-orange-500' };
    if (strength === 3) return { label: 'Fair', color: 'text-yellow-500' };
    if (strength === 4) return { label: 'Strong', color: 'text-blue-600' };
    return { label: 'Very Strong', color: 'text-green-600' };
  };

  const strengthBarColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    if (strength < 3) return;
    setSuccessMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length === 6) {
      setTwoFAEnabled(true);
      setOtpSent(false);
      setOtp(['', '', '', '', '', '']);
      setSuccessMsg('2FA enabled successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const requirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'At least 12 characters (recommended)', met: newPassword.length >= 12 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(newPassword) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security & Access</h1>
        <p className="text-gray-500 mt-1">Manage your account security and authentication</p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock size={16} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-800">Change Password</h2>
          </div>

          <div className="space-y-3">
            {/* Current Password */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Bar */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthBarColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthLabel().color}`}>
                    {strengthLabel().label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Passwords do not match
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check size={12} /> Passwords match
                </p>
              )}
            </div>

            {/* Requirements */}
            {newPassword && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100' : 'bg-gray-200'}`}>
                        {req.met && <Check size={10} className="text-green-600" />}
                      </div>
                      <p className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                        {req.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePasswordSave}
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || strength < 3}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Smartphone size={16} className="text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-800">Two-Factor Authentication</h2>
          </div>

          {/* Status */}
          <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${twoFAEnabled ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
            <div className="flex items-center gap-2">
              <Shield size={18} className={twoFAEnabled ? 'text-green-600' : 'text-gray-400'} />
              <div>
                <p className="text-sm font-medium text-gray-800">2FA Status</p>
                <p className={`text-xs ${twoFAEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {twoFAEnabled ? 'Enabled and Active' : 'Not enabled'}
                </p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
              {twoFAEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Steps */}
          {!twoFAEnabled && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {activeStep > step ? <Check size={12} /> : step}
                    </div>
                    {step < 3 && <div className={`h-0.5 w-8 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 flex justify-between px-1">
                <span>Setup</span>
                <span>Verify</span>
                <span>Done</span>
              </div>
            </div>
          )}

          {!twoFAEnabled && !otpSent && (
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Key size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">Enable 2FA Protection</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account using your mobile phone.</p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1 pl-2">
                <p>📱 Step 1: Click "Send OTP" below</p>
                <p>💬 Step 2: Enter the 6-digit code</p>
                <p>✅ Step 3: 2FA will be activated</p>
              </div>
              <button
                onClick={() => { setOtpSent(true); setActiveStep(2); }}
                className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
              >
                Send OTP Code
              </button>
            </div>
          )}

          {!twoFAEnabled && otpSent && (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-sm text-purple-700 font-medium">OTP sent to your phone!</p>
                <p className="text-xs text-purple-500 mt-0.5">Enter any 6 digits to verify (demo)</p>
              </div>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-10 h-12 border-2 border-gray-200 rounded-lg text-center text-lg font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.join('').length !== 6}
                className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                Verify & Enable 2FA
              </button>
              <button
                onClick={() => { setOtpSent(false); setActiveStep(1); }}
                className="w-full text-gray-500 text-sm hover:text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          )}

          {twoFAEnabled && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={32} className="text-green-600" />
              </div>
              <p className="font-medium text-gray-800 mb-1">2FA is Active!</p>
              <p className="text-xs text-gray-500 mb-4">Your account is protected with two-factor authentication</p>
              <button
                onClick={() => { setTwoFAEnabled(false); setActiveStep(1); }}
                className="text-xs text-red-500 hover:text-red-700 transition"
              >
                Disable 2FA
              </button>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            Security Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔐', title: 'Use Strong Passwords', desc: 'Use at least 12 characters with mix of letters, numbers and symbols.' },
              { icon: '📱', title: 'Enable 2FA', desc: 'Two-factor authentication adds an extra layer of protection to your account.' },
              { icon: '🚫', title: 'Avoid Sharing', desc: 'Never share your password or OTP with anyone, including support staff.' },
            ].map((tip, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-4">
                <p className="text-2xl mb-2">{tip.icon}</p>
                <p className="text-sm font-medium text-gray-800 mb-1">{tip.title}</p>
                <p className="text-xs text-gray-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}