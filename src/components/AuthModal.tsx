import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, LogOut, KeyRound, Check, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  onOpenAdminPanel?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  onOpenAdminPanel
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'dashboard'>('login');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Dashboard States (Normal user credential edit)
  const [dashEmail, setDashEmail] = useState(currentUser?.email || '');
  const [dashName, setDashName] = useState(currentUser?.name || '');
  const [dashOldPassword, setDashOldPassword] = useState('');
  const [dashNewPassword, setDashNewPassword] = useState('');
  const [dashConfirmPassword, setDashConfirmPassword] = useState('');
  const [dashError, setDashError] = useState('');
  const [dashSuccess, setDashSuccess] = useState('');

  // Sync user values when logged in
  React.useEffect(() => {
    if (currentUser) {
      setDashEmail(currentUser.email);
      setDashName(currentUser.name);
      setMode('dashboard');
    } else {
      setMode('login');
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Todos los campos son obligatorios.');
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) {
          setLoginError(error.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
          return;
        }

        if (data.user) {
          // Fetch public profile if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userObj: User = {
            id: data.user.id,
            name: profile?.name || data.user.user_metadata?.name || 'Usuario',
            email: data.user.email || '',
            password: '',
            role: profile?.role || data.user.user_metadata?.role || 'user',
            createdAt: new Date(data.user.created_at).toLocaleDateString('es-VE'),
          };

          setCurrentUser(userObj);
          localStorage.setItem('tellex_current_user', JSON.stringify(userObj));
          setLoginEmail('');
          setLoginPassword('');
          onClose();
        }
      } catch (err: any) {
        setLoginError(err.message || 'Error al iniciar sesión.');
      }
    } else {
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );

      if (foundUser) {
        setCurrentUser(foundUser);
        localStorage.setItem('tellex_current_user', JSON.stringify(foundUser));
        setLoginEmail('');
        setLoginPassword('');
        onClose();
      } else {
        setLoginError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Todos los campos son obligatorios.');
      return;
    }

    if (regPassword.length < 5) {
      setRegError('La contraseña debe tener al menos 5 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
          options: {
            data: {
              name: regName,
              role: 'user'
            }
          }
        });

        if (error) {
          setRegError(error.message || 'Error registrando usuario.');
          return;
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            name: regName,
            email: regEmail,
            password: '',
            role: 'user',
            createdAt: new Date(data.user.created_at).toLocaleDateString('es-VE')
          };

          setRegSuccess(true);
          setCurrentUser(newUser);
          localStorage.setItem('tellex_current_user', JSON.stringify(newUser));

          setTimeout(() => {
            setRegName('');
            setRegEmail('');
            setRegPassword('');
            setRegConfirmPassword('');
            setRegSuccess(false);
            onClose();
          }, 1500);
        }
      } catch (err: any) {
        setRegError(err.message || 'Error al registrar.');
      }
    } else {
      const emailExists = users.some((u) => u.email.toLowerCase() === regEmail.toLowerCase());
      if (emailExists) {
        setRegError('Este correo ya está registrado.');
        return;
      }

      const newUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: regName,
        email: regEmail,
        password: regPassword,
        role: 'user', // Default is normal user
        createdAt: new Date().toLocaleDateString('es-VE')
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('tellex_users', JSON.stringify(updatedUsers));

      setRegSuccess(true);
      setCurrentUser(newUser);
      localStorage.setItem('tellex_current_user', JSON.stringify(newUser));

      setTimeout(() => {
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotEmail) {
      setForgotError('Introduce tu correo electrónico.');
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
          redirectTo: window.location.origin
        });

        if (error) {
          setForgotError(error.message || 'Error enviando enlace de recuperación.');
          return;
        }

        setForgotSuccess(true);
        setForgotEmail('');
      } catch (err: any) {
        setForgotError(err.message || 'Error de conexión.');
      }
    } else {
      const userExists = users.some((u) => u.email.toLowerCase() === forgotEmail.toLowerCase());
      if (!userExists) {
        setForgotError('No encontramos una cuenta con ese correo electrónico.');
        return;
      }

      setForgotSuccess(true);
      setForgotEmail('');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashError('');
    setDashSuccess('');

    if (!currentUser) return;

    if (!dashName || !dashEmail) {
      setDashError('Nombre y Correo son obligatorios.');
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        // 1. Update metadata name
        const { error: metaErr } = await supabase.auth.updateUser({
          data: { name: dashName }
        });

        if (metaErr) {
          setDashError(metaErr.message || 'Error actualizando metadatos.');
          return;
        }

        // 2. Update profiles table
        const { error: dbErr } = await supabase
          .from('profiles')
          .update({ name: dashName })
          .eq('id', currentUser.id);

        if (dbErr) {
          console.error('Error updating public profiles:', dbErr);
        }

        // 3. Update password if provided
        if (dashNewPassword) {
          if (dashNewPassword.length < 5) {
            setDashError('La nueva contraseña debe tener al menos 5 caracteres.');
            return;
          }
          if (dashNewPassword !== dashConfirmPassword) {
            setDashError('Las nuevas contraseñas no coinciden.');
            return;
          }

          const { error: passErr } = await supabase.auth.updateUser({
            password: dashNewPassword
          });

          if (passErr) {
            setDashError(passErr.message || 'Error actualizando contraseña.');
            return;
          }
        }

        const updatedUser: User = {
          ...currentUser,
          name: dashName,
          email: dashEmail
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('tellex_current_user', JSON.stringify(updatedUser));

        setDashSuccess('Datos actualizados correctamente.');
        setDashOldPassword('');
        setDashNewPassword('');
        setDashConfirmPassword('');

        setTimeout(() => {
          setDashSuccess('');
        }, 3000);
      } catch (err: any) {
        setDashError(err.message || 'Error al actualizar perfil.');
      }
    } else {
      // Verify email conflict
      const otherEmailExists = users.some(
        (u) => u.id !== currentUser.id && u.email.toLowerCase() === dashEmail.toLowerCase()
      );
      if (otherEmailExists) {
        setDashError('Este correo electrónico ya está registrado por otro usuario.');
        return;
      }

      // Check if user is changing password
      let updatedPassword = currentUser.password;
      if (dashOldPassword || dashNewPassword || dashConfirmPassword) {
        if (currentUser.password !== dashOldPassword) {
          setDashError('La contraseña actual es incorrecta.');
          return;
        }
        if (dashNewPassword.length < 5) {
          setDashError('La nueva contraseña debe tener al menos 5 caracteres.');
          return;
        }
        if (dashNewPassword !== dashConfirmPassword) {
          setDashError('Las nuevas contraseñas no coinciden.');
          return;
        }
        updatedPassword = dashNewPassword;
      }

      const updatedUser: User = {
        ...currentUser,
        name: dashName,
        email: dashEmail,
        password: updatedPassword
      };

      const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      setUsers(updatedUsers);
      localStorage.setItem('tellex_users', JSON.stringify(updatedUsers));

      setCurrentUser(updatedUser);
      localStorage.setItem('tellex_current_user', JSON.stringify(updatedUser));

      setDashSuccess('Datos actualizados correctamente.');
      setDashOldPassword('');
      setDashNewPassword('');
      setDashConfirmPassword('');

      setTimeout(() => {
        setDashSuccess('');
      }, 3000);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('tellex_current_user');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="auth-modal-overlay">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 z-10 flex flex-col overflow-hidden max-h-[90vh]"
            id="auth-modal-content"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              id="close-auth-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo area */}
            <div className="text-center mb-6">
              <img
                src="https://i.postimg.cc/ZnZs8N5j/logoweb-tellex.png"
                alt="TELLEX logo"
                referrerPolicy="no-referrer"
                className="h-12 w-auto object-contain mx-auto"
              />
            </div>

            <div className="overflow-y-auto pr-1 no-scrollbar">
              {/* MODE: LOGIN */}
              {mode === 'login' && (
                <div id="login-flow">
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
                    Ingresar a mi Cuenta
                  </h3>
                  <p className="text-xs text-slate-400 text-center mb-6">
                    Compra productos o solicita inspecciones prioritarias.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium">
                        {loginError}
                      </p>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="login-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] font-bold text-[#ca531a] hover:underline"
                        >
                          ¿Olvidé mi contraseña?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="Tu contraseña"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full text-sm pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="login-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm mt-2"
                      id="submit-login"
                    >
                      Iniciar Sesión
                    </button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                      ¿No tienes una cuenta aún?{' '}
                      <button
                        onClick={() => setMode('register')}
                        className="font-bold text-[#24411a] hover:underline"
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* MODE: REGISTER */}
              {mode === 'register' && (
                <div id="register-flow">
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
                    Crear Nueva Cuenta
                  </h3>
                  <p className="text-xs text-slate-400 text-center mb-6">
                    Regístrate para ver productos y cotizar tus servicios.
                  </p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    {regError && (
                      <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium">
                        {regError}
                      </p>
                    )}

                    {regSuccess && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-medium flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" /> ¡Registro exitoso! Iniciando sesión...
                      </p>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Ej. Sofia Valenzuela"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="register-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="register-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            placeholder="Mín. 5 carac."
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full text-xs pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                            id="register-password"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Confirmar
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            placeholder="Repetir"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full text-xs pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                            id="register-confirm-password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="show-reg-pass-check"
                        checked={showRegPassword}
                        onChange={(e) => setShowRegPassword(e.target.checked)}
                        className="rounded text-[#ca531a] focus:ring-[#ca531a] w-3.5 h-3.5 accent-[#ca531a]"
                      />
                      <label htmlFor="show-reg-pass-check" className="text-[11px] text-slate-500 cursor-pointer select-none font-medium">
                        Mostrar contraseñas
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#24411a] hover:bg-[#24411a]/95 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm mt-2"
                      id="submit-register"
                    >
                      Registrar Cuenta
                    </button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="font-bold text-[#ca531a] hover:underline"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* MODE: FORGOT PASSWORD */}
              {mode === 'forgot' && (
                <div id="forgot-flow">
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
                    ¿Olvidaste tu Contraseña?
                  </h3>
                  <p className="text-xs text-slate-400 text-center mb-6">
                    Ingresa tu correo y te enviaremos las instrucciones de recuperación.
                  </p>

                  <form onSubmit={handleForgot} className="space-y-4">
                    {forgotError && (
                      <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium">
                        {forgotError}
                      </p>
                    )}

                    {forgotSuccess ? (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                          <Check className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-emerald-800 text-sm">Correo de Recuperación Enviado</h4>
                        <p className="text-xs text-emerald-600 leading-relaxed">
                          Hemos enviado un enlace seguro a tu correo electrónico para restablecer tu contraseña. Revisa también tu bandeja de spam.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotSuccess(false);
                            setMode('login');
                          }}
                          className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 block mx-auto"
                        >
                          Volver al inicio de sesión
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                            Tu Correo Electrónico
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                              id="forgot-email"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm mt-2"
                          id="submit-forgot"
                        >
                          Enviar Enlace de Recuperación
                        </button>

                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="w-full text-xs text-slate-500 font-bold hover:underline py-1"
                        >
                          Cancelar y Volver
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}

              {/* MODE: DASHBOARD (EDIT USER PROFILE & CREDENTIALS) */}
              {mode === 'dashboard' && currentUser && (
                <div id="dashboard-flow" className="space-y-5">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#ca531a]/10 rounded-full flex items-center justify-center text-[#ca531a] font-bold text-base shadow-inner">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                          {currentUser.name}
                          {currentUser.role === 'admin' && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-amber-200">
                              <Shield className="w-2.5 h-2.5" /> ADMIN
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">Mi Perfil de Usuario</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>

                  {currentUser.role === 'admin' && onOpenAdminPanel && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdminPanel();
                      }}
                      className="w-full bg-[#24411a] hover:bg-[#24411a]/90 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md border border-[#24411a]/20"
                    >
                      <Shield className="w-4 h-4" /> Consola de Administración Completa
                    </button>
                  )}

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Modificar mis Datos
                    </h4>

                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                      {dashError && (
                        <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium">
                          {dashError}
                        </p>
                      )}

                      {dashSuccess && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-medium">
                          {dashSuccess}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={dashName}
                            onChange={(e) => setDashName(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                            id="dash-name"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            value={dashEmail}
                            onChange={(e) => setDashEmail(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                            id="dash-email"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-2 mt-2">
                        <span className="text-[10px] font-bold text-[#ca531a] uppercase tracking-wider flex items-center gap-1">
                          <KeyRound className="w-3.5 h-3.5" /> Cambiar Contraseña (Opcional)
                        </span>

                        <div className="space-y-1.5">
                          <input
                            type="password"
                            placeholder="Contraseña Actual"
                            value={dashOldPassword}
                            onChange={(e) => setDashOldPassword(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] transition-all"
                            id="dash-old-password"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="password"
                              placeholder="Nueva Contraseña"
                              value={dashNewPassword}
                              onChange={(e) => setDashNewPassword(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] transition-all"
                              id="dash-new-password"
                            />
                            <input
                              type="password"
                              placeholder="Confirmar Nueva"
                              value={dashConfirmPassword}
                              onChange={(e) => setDashConfirmPassword(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] transition-all"
                              id="dash-confirm-password"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                        id="submit-dash-update"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Guardar Cambios
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
