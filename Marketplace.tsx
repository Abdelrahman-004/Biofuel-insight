import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

interface MarketplaceProps {
  language: 'English' | 'Arabic';
}

const MOCK_PROJECTS = [

  {
    id: 'PRJ-101',
    titleEn: 'Al-Wusta Macroalgae to SAF Facility',
    titleAr: 'منشأة الوسطى لتحويل الطحالب إلى وقود طيران مستدام',
    type: 'Algae-to-SAF',
    location: 'Duqm',
    fundingRequired: 4500000,
    trl: 7,
    roi: 18.5,
    payback: 4.2,
    matchScore: 92,
    author: 'Dr. Ahmed Al-Balushi',
    institution: 'SQU & Duqm Labs',
    status: 'Verified',
    risk: 'Medium',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'PRJ-102',
    titleEn: 'Muscat MSW to Biodiesel Plant',
    titleAr: 'محطة مسقط لتحويل النفايات الصلبة إلى ديزل حيوي',
    type: 'Waste-to-Fuel',
    location: 'Barka',
    fundingRequired: 1200000,
    trl: 9,
    roi: 24.0,
    payback: 2.8,
    matchScore: 85,
    author: 'GreenOman Startup',
    institution: 'Oman Tech Fund',
    status: 'Verified',
    risk: 'Low',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'PRJ-103',
    titleEn: 'Salalah Port Used Cooking Oil Refinery',
    titleAr: 'مصفاة زيوت الطبخ المستعملة بميناء صلالة',
    type: 'UCO Biodiesel',
    location: 'Salalah',
    fundingRequired: 2800000,
    trl: 8,
    roi: 21.0,
    payback: 3.5,
    matchScore: 78,
    author: 'EcoFuel Trading LLC',
    institution: 'Private Sector',
    status: 'Pending',
    risk: 'Medium-Low',
    image: 'https://images.unsplash.com/photo-1605648873724-4f4ee8fd31ab?q=80&w=1000&auto=format&fit=crop'
  }
];

export const Marketplace: React.FC<MarketplaceProps> = ({ language }) => {
  const isArabic = language === 'Arabic';
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authRole, setAuthRole] = useState<'RESEARCHER' | 'INVESTOR' | 'GUEST' | null>(null);
  const [userAlias, setUserAlias] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If user is guest, don't overwrite with null from firebase auth straight away
      if (authRole === 'GUEST') return;

      if (user) {
        setCurrentUser(user);
        // fetch role from firesore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setAuthRole(userDoc.data().role);
            setUserAlias(userDoc.data().name || user.displayName || '');
          } else {
            // we will let the auth screen handle this
            setAuthRole(null);
            setCurrentUser(null);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setCurrentUser(null);
        setAuthRole(null);
        setUserAlias('');
      }
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (isInitializing) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[var(--accent-emerald)] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!authRole || (authRole !== 'GUEST' && !currentUser)) {
    return <AuthScreen language={language} onLoginSuccess={(role, alias) => {
      setAuthRole(role);
      if (alias) setUserAlias(alias);
      if (role === 'GUEST') {
        setIsGuest(true);
      } else if (auth.currentUser) {
        setCurrentUser(auth.currentUser);
      }
    }} />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] animate-in fade-in duration-500" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-8 bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-glow)] shadow-sm">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white ${authRole === 'INVESTOR' || authRole === 'GUEST' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
            <i className={`fas ${authRole === 'INVESTOR' || authRole === 'GUEST' ? 'fa-user-tie' : 'fa-user-graduate'}`}></i>
          </div>
          <div>
            <h2 className="font-black text-[var(--text-primary)] leading-tight text-lg">
              {isArabic ? 'مرحباً، ' : 'Welcome, '}
              {authRole === 'GUEST' ? (isArabic ? 'زائر' : 'Guest') : (userAlias || (authRole === 'INVESTOR' ? (isArabic ? 'مستثمر' : 'Investor') : (isArabic ? 'دكتور' : 'Researcher')))}
            </h2>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {authRole === 'GUEST' ? (isArabic ? 'حساب زائر (للعرض فقط)' : 'Guest Account (View Only)') : currentUser?.email}
            </p>
          </div>
        </div>
        <button 
          onClick={async () => {
            if (authRole === 'GUEST') {
              setAuthRole(null);
              setIsGuest(false);
            } else {
              try {
                await signOut(auth);
              } catch (e) {
                console.error(e);
              }
            }
          }}
          className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-2"
          title={isArabic ? 'تسجيل الخروج' : 'Logout'}
        >
          <i className="fas fa-sign-out-alt text-xl"></i>
        </button>
      </div>

      {authRole === 'INVESTOR' || authRole === 'GUEST' ? <InvestorDashboard language={language} user={currentUser} isGuest={authRole === 'GUEST'} /> : <ResearcherDashboard language={language} user={currentUser!} userAlias={userAlias} />}
    </div>
  );
};


// ... AuthScreen here
const AuthScreen = ({ language, onLoginSuccess }: { language: string, onLoginSuccess: (role: 'RESEARCHER' | 'INVESTOR' | 'GUEST', alias?: string) => void }) => {
  const isArabic = language === 'Arabic';
  const [selectedRole, setSelectedRole] = useState<'RESEARCHER' | 'INVESTOR'>('INVESTOR');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [alias, setAlias] = useState('');

  const handleLogin = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Ensure user profile exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        try {
          const finalAlias = alias.trim() || result.user.displayName || 'Unknown';
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email || '',
            role: selectedRole,
            name: finalAlias,
            institution: '',
            fundingCapacity: 0,
            isVerified: false,
            createdAt: serverTimestamp()
          });
          onLoginSuccess(selectedRole, finalAlias);
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, `users/${result.user.uid}`);
        }
      } else {
        // If user already exists, update alias if provided
        const finalAlias = alias.trim() || userDoc.data().name;
        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            name: finalAlias,
            role: selectedRole // Allow switching roles for testing
          }, { merge: true });
          onLoginSuccess(selectedRole, finalAlias);
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `users/${result.user.uid}`);
        }
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/popup-closed-by-user') {
        // User closed the popup, silently return
        return;
      }
      alert(isArabic ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Login failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="max-w-md w-full bg-[var(--nav-bg)] backdrop-blur-2xl p-8 rounded-3xl border border-[var(--border-glow)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-2">
            {isArabic ? 'بوابة الدخول' : 'Access Portal'}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm font-medium">
            {isArabic ? 'منصة الاستثمار والبحوث الذكية للوقود الحيوي' : 'Smart Biofuel Investment & Research Platform'}
          </p>
        </div>

        <div className="flex rounded-xl bg-[var(--bg-main)] p-1.5 mb-8 border border-[var(--border-glow)] shadow-inner">
          <button
            onClick={() => setSelectedRole('INVESTOR')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${selectedRole === 'INVESTOR' ? 'bg-[var(--card-bg)] text-[var(--accent-emerald)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <i className="fas fa-briefcase mr-2 rtl:ml-2 rtl:mr-0"></i>
            {isArabic ? 'مستثمر' : 'Investor'}
          </button>
          <button
            onClick={() => setSelectedRole('RESEARCHER')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${selectedRole === 'RESEARCHER' ? 'bg-[var(--card-bg)] text-blue-500 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <i className="fas fa-microscope mr-2 rtl:ml-2 rtl:mr-0"></i>
            {isArabic ? 'باحث / مبتكر' : 'Researcher'}
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-glow)] flex space-x-3 rtl:space-x-reverse">
          <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
            {isArabic 
              ? 'يرجى تسجيل الدخول باستخدام حساب جوجل للوصول إلى المنصة.'
              : 'Please sign in using your Google account to access the platform.'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            {isArabic ? 'الاسم المستعار (اختياري)' : 'Alias / Nickname (Optional)'}
          </label>
          <input 
            type="text" 
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[var(--accent-emerald)] focus:ring-1 focus:ring-[var(--accent-emerald)] transition-all font-medium"
            placeholder={isArabic ? 'مثال: باحث مبتكر' : 'e.g. Green Innovator'}
          />
        </div>

        <div className="space-y-3">
          <button 
              onClick={handleLogin}
              disabled={isSigningIn}
              className="w-full bg-[var(--card-bg)] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 border border-[var(--border-glow)] text-[var(--text-primary)] font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
              {isSigningIn ? (isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...') : (isArabic ? 'دخول باستخدام جوجل' : 'Sign in with Google')}
          </button>
          
          <button 
              onClick={() => onLoginSuccess('GUEST')}
              disabled={isSigningIn}
              className="w-full bg-[var(--bg-main)] hover:bg-[#E2E8F0] dark:hover:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold py-4 rounded-xl transition-all flex items-center justify-center group"
            >
              <i className="fas fa-user-secret mr-3 rtl:ml-3 rtl:mr-0"></i>
              {isArabic ? 'الدخول كزائر (للعرض فقط)' : 'Continue as Guest (View Only)'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InvestorDashboard = ({ language, user, isGuest }: { language: string, user: User | null, isGuest?: boolean }) => {
  const isArabic = language === 'Arabic';
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'AI' | 'RESEARCHER'>('AI');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Load real projects from firestore
    const fetchProjects = async () => {
      if (isGuest) {
        setProjects(MOCK_PROJECTS.map(p => ({ ...p, isAiGenerated: true })));
        return;
      }
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const allProjects = [
          ...MOCK_PROJECTS.map(p => ({ ...p, isAiGenerated: true })),
          ...fetched.map(p => ({ ...p, isAiGenerated: false }))
        ];
        setProjects(allProjects);
      } catch (err) {
        console.error("Firestore error while fetching projects:", err);
        setProjects(MOCK_PROJECTS.map(p => ({ ...p, isAiGenerated: true })));
      }
    };
    fetchProjects();
  }, [isGuest]);

  const displayedProjects = projects.filter(p => activeTab === 'AI' ? p.isAiGenerated : !p.isAiGenerated);

  if (selectedProject) {
    return <ProjectDetails project={selectedProject} isArabic={isArabic} onBack={() => setSelectedProject(null)} viewer="INVESTOR" isGuest={isGuest} language={language} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-glow)] shadow-sm">
          <p className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-1">{isArabic ? 'مشاريع مقترحة لك' : 'Matched Projects'}</p>
          <div className="text-3xl font-black text-[var(--accent-emerald)]">14</div>
        </div>
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-glow)] shadow-sm">
          <p className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-1">{isArabic ? 'تحت الدراسة' : 'Under Review'}</p>
          <div className="text-3xl font-black text-amber-500">3</div>
        </div>
        <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-900/40 dark:to-slate-900/40 p-6 rounded-2xl border border-[var(--border-glow)] shadow-sm text-[var(--text-primary)] flex items-center justify-between">
            <div>
              <h3 className="font-black mb-1">{isArabic ? 'محرك التوافق الذكي نشط' : 'Smart Matching Engine Active'}</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-100/70 font-medium max-w-sm">
                {isArabic ? 'يتم مطابقة المشاريع مع معايير المخاطر والميزانية الخاصة بك.' : 'Projects are being filtered based on your risk appetite and budget of $10M.'}
              </p>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs px-4 py-2 rounded-lg transition-colors">
              {isArabic ? 'تحديث المعايير' : 'Update Criteria'}
            </button>
        </div>
      </div>

      <div className="mb-6 mt-8">
        <div className="flex rounded-xl bg-[var(--bg-main)] p-1.5 border border-[var(--border-glow)] shadow-inner w-full max-w-md mx-auto mb-8">
          <button
            onClick={() => setActiveTab('AI')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'AI' ? 'bg-[var(--card-bg)] text-[var(--accent-emerald)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <i className="fas fa-robot mr-2 rtl:ml-2 rtl:mr-0"></i>
            {isArabic ? 'مقترحات الذكاء الاصطناعي' : 'AI Proposed'}
          </button>
          <button
            onClick={() => setActiveTab('RESEARCHER')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'RESEARCHER' ? 'bg-[var(--card-bg)] text-blue-500 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <i className="fas fa-user-graduate mr-2 rtl:ml-2 rtl:mr-0"></i>
            {isArabic ? 'مشاريع الباحثين' : 'Researcher Projects'}
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              {activeTab === 'AI' ? (isArabic ? 'فرص استثمارية مقترحة بالذكاء الاصطناعي' : 'AI Generated Investment Opportunities') : (isArabic ? 'مشاريع حقيقية من الباحثين' : 'Active Researcher Listings')}
            </h2>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {isArabic ? 'مرتبة بناءً على نسبة التوافق مع محفظتك' : 'Sorted by match score according to your portfolio'}
            </p>
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <i className="fas fa-filter mr-2 rtl:ml-2 rtl:mr-0"></i> {isArabic ? 'تصفية' : 'Filter'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {displayedProjects.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <i className="fas fa-inbox text-4xl text-[var(--text-secondary)] mb-4 opacity-50"></i>
            <p className="text-[var(--text-secondary)] font-medium">
              {isArabic ? 'لا توجد مشاريع في هذا القسم حالياً' : 'No projects found in this section yet.'}
            </p>
          </div>
        ) : displayedProjects.map(project => (
          <div key={project.id} onClick={() => setSelectedProject(project)} className="bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-3xl overflow-hidden hover:border-[var(--accent-emerald)]/50 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
            <div className="h-48 relative overflow-hidden bg-[#F1F5F9] dark:bg-slate-800">
              <img src={project.image || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop'} alt="Project" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

              <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                {project.type}
              </div>
              <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto bg-emerald-500 text-emerald-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center">
                <i className="fas fa-bolt mr-1 rtl:ml-1 rtl:mr-0"></i> {project.matchScore}% {isArabic ? 'توافق' : 'Match'}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight group-hover:text-[var(--accent-emerald)] transition-colors">
                  {isArabic ? project.titleAr : project.titleEn}
                </h3>
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-4 flex items-center">
                <i className="fas fa-map-marker-alt text-[var(--accent-emerald)] mr-1 rtl:ml-1 rtl:mr-0"></i> {project.location}, Oman
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)] mb-1">{language === 'Arabic' ? "التمويل" : "Funding"}</p>
                  <p className="font-black text-[var(--text-primary)]">${(project.fundingRequired / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)] mb-1">{language === 'Arabic' ? "معدل العائد" : "IRR"}</p>
                  <p className="font-black text-emerald-500">{project.roi}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-glow)]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">
                    <i className="fas fa-user text-[var(--text-secondary)]"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-primary)] line-clamp-1">{project.author}</p>
                    <p className="text-[9px] font-medium text-[var(--text-secondary)] line-clamp-1">{project.institution}</p>
                  </div>
                </div>
                {project.status === 'Verified' && (
                  <i className="fas fa-check-circle text-blue-500 text-lg" title="Verified Project"></i>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResearcherDashboard = ({ language, user, userAlias }: { language: string, user: User, userAlias: string }) => {
  const isArabic = language === 'Arabic';
  const [viewState, setViewState] = useState<'LIST' | 'NEW'>('LIST');
  const [projects, setProjects] = useState<any[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Algae-to-SAF');
  const [funding, setFunding] = useState('');
  const [location, setLocation] = useState('Duqm SEZAD');
  const [trl, setTrl] = useState(5);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load researcher projects filtering manually since we didn't add index for authorId yet
    // Actually we can query by authorId if we make a proper query
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const allFetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const myProjects = allFetched.filter((p: any) => p.authorId === user.uid);
        if (myProjects.length > 0) {
          setProjects(myProjects);
        } else {
          setProjects([{...MOCK_PROJECTS[0], authorId: user.uid, isMock: true}]); // Add one mock so it doesn't look empty
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'projects');
      }
    };
    if (viewState === 'LIST') fetchProjects();
  }, [viewState, user.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newRef = doc(collection(db, 'projects'));
      await setDoc(newRef, {
        titleEn: title,
        titleAr: title,
        type: type,
        location: location,
        fundingRequired: Number(funding),
        trl: trl,
        roi: Math.floor(Math.random() * 15) + 8, // mock AI calculation
        payback: Math.floor(Math.random() * 5) + 2, // mock AI calculation
        matchScore: Math.floor(Math.random() * 20) + 70, // mock match
        authorId: user.uid,
        authorName: userAlias || user.displayName || 'Researcher',
        institution: 'Startup / University',
        status: 'Pending',
        risk: 'Medium',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop',
        description: 'New submitted project...',
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        createdAt: serverTimestamp()
      });
      setViewState('LIST');
      alert(isArabic ? "تم حفظ المشروع للمراجعة وبنجاح" : "Project saved successfully!");
      
      // Reset form
      setTitle('');
      setFunding('');
      setContactEmail('');
      setContactPhone('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
      alert(isArabic ? "حدث خطأ" : "Error saving project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (viewState === 'NEW') {
    return (
      <div className="max-w-4xl mx-auto bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              {isArabic ? 'إضافة مشروع جديد' : 'Submit New Project'}
            </h2>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
              {isArabic ? 'سيتم دراسة جدوى المشروع آلياً قبل عرضه للمستثمرين' : 'Project will be automatically analyzed for feasibility before listing.'}
            </p>
          </div>
          <button 
            onClick={() => setViewState('LIST')}
            className="w-10 h-10 rounded-full border border-[var(--border-glow)] flex items-center justify-center hover:bg-[var(--bg-main)] transition-colors"
          >
            <i className="fas fa-times text-[var(--text-secondary)]"></i>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'عنوان المشروع' : 'Project Title'}
              </label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'نوع الوقود الحيوي' : 'Biofuel Category'}
              </label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none">
                <option value="Algae-to-SAF">{language === 'Arabic' ? "وقود الطيران المستدام من الطحالب" : "Algae-to-SAF"}</option>
                <option value="Waste-to-BioDiesel">{language === 'Arabic' ? "الديزل الحيوي من النفايات" : "Waste-to-BioDiesel"}</option>
                <option value="Green Hydrogen">{language === 'Arabic' ? "الهيدروجين الأخضر" : "Green Hydrogen"}</option>
                <option value="Biogas / RNG">Biogas / RNG</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'التمويل المطلوب (دولار)' : 'Required Funding (USD)'}
              </label>
              <input type="number" value={funding} onChange={e => setFunding(e.target.value)} required placeholder="e.g. 5000000" className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'الموقع المقترح في عُمان' : 'Proposed Location'}
              </label>
              <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none">
                <option value="Duqm SEZAD">{language === 'Arabic' ? "المنطقة الاقتصادية الخاصة بالدقم" : "Duqm SEZAD"}</option>
                <option value="Sohar Freezone">{language === 'Arabic' ? "منطقة صحار الحرة" : "Sohar Freezone"}</option>
                <option value="Salalah Port">{language === 'Arabic' ? "ميناء صلالة" : "Salalah Port"}</option>
                <option value="Muscat Innovation Park">{language === 'Arabic' ? "مجمع الابتكار بمسقط" : "Muscat Innovation Park"}</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'مستوى النضج التكنولوجي (TRL)' : 'Technology Readiness Level (TRL 1-9)'}
              </label>
              <input type="range" min="1" max="9" value={trl} onChange={e => setTrl(Number(e.target.value))} className="w-full" />

              <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-bold">
                <span>TRL 1 (Idea)</span>
                <span>TRL 5 (Lab Tested)</span>
                <span>TRL 9 (Commercial)</span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}
              </label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors" />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'رقم هاتف التواصل' : 'Contact Phone'}
              </label>
              <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required placeholder="+968..." className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl focus:border-blue-500 focus:outline-none transition-colors" dir="ltr" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                {isArabic ? 'الملف التعريفي / البحث (PDF)' : 'Pitch Deck / Research Paper (PDF)'}
              </label>
              <div className="border-2 border-dashed border-[var(--border-glow)] rounded-xl p-8 text-center hover:bg-[var(--bg-main)] transition-colors cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-3xl text-blue-400 mb-3"></i>
                <p className="text-sm font-medium text-[var(--text-primary)]">{isArabic ? 'اضغط لرفع الملفات' : 'Click to Upload Files'}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{language === 'Arabic' ? "ملف PDF بحجم يصل إلى 20 ميغابايت" : "PDF up to 20MB"}</p>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[var(--border-glow)] flex justify-end space-x-3 rtl:space-x-reverse">
            <button type="button" onClick={() => setViewState('LIST')} className="px-6 py-3 font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-xl">
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50">
              {isSubmitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال وتحليل الجدوى' : 'Submit & Analyze')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
            {isArabic ? 'لوحة تحكم الباحث' : 'Researcher Dashboard'}
          </h2>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {isArabic ? 'مشاريعك المعروضة للمستثمرين' : 'Your active projects presented to investors'}
          </p>
        </div>
        <button 
          onClick={() => setViewState('NEW')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center"
        >
          <i className="fas fa-plus mr-2 rtl:ml-2 rtl:mr-0"></i> {isArabic ? 'إضافة مشروع' : 'Add Project'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
        <div key={p.id} className="bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div className={`px-3 py-1 ${p.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'} text-[10px] font-black uppercase tracking-widest rounded-full`}>
              {isArabic ? (p.status === 'Pending' ? 'التحليل معلق' : 'نشط للمستثمرين') : (p.status === 'Pending' ? 'Pending Analysis' : 'Active Listing')}
            </div>
            <i className="fas fa-ellipsis-v text-[var(--text-secondary)] p-2 cursor-pointer hover:text-[var(--text-primary)]"></i>
          </div>
          
          <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight mb-2">
            {isArabic ? p.titleAr : p.titleEn}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium mb-6 line-clamp-2">
            {p.description || "Scaling local biofuel operations in Oman using advanced technologies."}
          </p>
          
          <div className="bg-[var(--bg-main)] rounded-xl p-4 mb-4 border border-[var(--border-glow)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">{language === 'Arabic' ? "مشاهدات المستثمرين" : "Investor Views"}</span>
              <span className="font-black text-[var(--text-primary)]">{p.isMock ? '124' : '0'}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">{language === 'Arabic' ? "طلبات الاجتماع" : "Meeting Requests"}</span>
              <span className="font-black text-amber-500 flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-2"></span> {p.isMock ? '3 New' : '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">{language === 'Arabic' ? "درجة الجدوى (الذكاء الاصطناعي)" : "AI Viability Score"}</span>
              <span className="font-black text-emerald-500">{p.matchScore || 'N/A'}/100</span>
            </div>
          </div>
          
          <button className="w-full py-2.5 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl transition-all">
            {isArabic ? 'عرض لوحة المستثمر الكاملة' : 'View Full Dashboard'}
          </button>
        </div>
        ))}
      </div>
    </div>
  )
}


const ProjectDetails = ({ project, isArabic, onBack, viewer, isGuest, language = 'English' }: { project: any, isArabic: boolean, onBack: () => void, viewer: 'INVESTOR' | 'RESEARCHER', isGuest?: boolean, language?: string }) => {
  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
      >
        <i className={`fas fa-arrow-${isArabic ? 'right' : 'left'} mr-2 rtl:ml-2 rtl:mr-0 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform`}></i>
        {isArabic ? 'العودة للمقترحات' : 'Back to Listings'}
      </button>

      <div className="bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-3xl overflow-hidden shadow-sm mb-6">
        <div className="h-64 relative bg-slate-900">
          <img src={project.image} alt="Project Header" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-6 px-8 w-full flex justify-between items-end">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                <span className="bg-emerald-500 text-emerald-950 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">
                  {project.matchScore}% {isArabic ? 'توافق' : 'Match'}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full">
                  TRL {project.trl}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">
                {isArabic ? (project.titleAr || project.titleEn) : project.titleEn}
              </h1>
            </div>
            
            <div className="flex space-x-3 rtl:space-x-reverse">
              {isGuest ? (
                 <button onClick={() => alert(isArabic ? 'يتطلب حساب للتسجيل لمزيد من التفاصيل' : 'Account required to contact researchers')} className="h-12 px-6 rounded-full bg-slate-800/80 dark:bg-slate-800/80 backdrop-blur-md text-white border border-slate-600 dark:border-slate-600 flex items-center justify-center text-sm font-bold shadow-lg" title="Sign in required">
                    <i className="fas fa-lock mr-2 rtl:ml-2 rtl:mr-0"></i> {isArabic ? 'التواصل (مقفول)' : 'Contact'}
                 </button>
              ) : (
                <>
                  <button className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center text-xl shadow-lg hover:scale-105 transition-transform" title="Request Meeting">
                    <i className="fas fa-calendar-check"></i>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg hover:scale-105 transition-transform" title="Chat with Researcher">
                    <i className="fas fa-comment-dots"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border-glow)] pb-2 flex justify-between items-center">
                  <span>{isArabic ? 'نظرة عامة على المشروع' : 'Project Overview'}</span>
                  <button className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-100 transition-colors">
                    <i className="fas fa-download mr-2 rtl:ml-2 rtl:mr-0"></i> Pitch Deck
                  </button>
                </h3>
                <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                  This project aims to establish an advanced {project.type} facility in the {project.location} region. 
                  Leveraging local resources and cutting-edge biochemical processing, the facility targets a production capacity 
                  capable of reducing regional carbon emissions by significant margins while offering competitive market prices.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border-glow)] pb-2 flex items-center">
                  <i className="fas fa-robot text-emerald-500 mr-2 rtl:ml-2 rtl:mr-0"></i>
                  {isArabic ? 'تقرير محرك الجدوى الذكي' : 'AI Feasibility Engine Report'}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider mb-1">CAPEX (Est.)</p>
                    <p className="text-xl font-black text-[var(--text-primary)]">${(project.fundingRequired / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider mb-1">{language === 'Arabic' ? "معدل العائد الداخلي المتوقع" : "Expected IRR"}</p>
                    <p className="text-xl font-black text-emerald-500">{project.roi}%</p>
                  </div>
                  <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider mb-1">{language === 'Arabic' ? "فترة الاسترداد" : "Payback Period"}</p>
                    <p className="text-xl font-black text-amber-500">{project.payback} Yrs</p>
                  </div>
                </div>

                <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-sm font-medium">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">AI Conclusion: </span>
                  Highly viable. The location in {project.location} offers excellent logistics synergy. Technical risk is {project.risk.toLowerCase()} due to TRL {project.trl} maturity.
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-6 rounded-2xl">
                <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-4">{isArabic ? 'معلومات الباحث' : 'Researcher Profile'}</h4>
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[var(--card-bg)] shadow-md overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)] line-clamp-1">{project.authorName || project.author}</p>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)]">{project.institution}</p>
                  </div>
                </div>
                {(project.contactEmail || project.contactPhone) && !isGuest && (
                  <div className="mb-4 space-y-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-glow)]">
                    {project.contactEmail && (
                      <div className="flex items-center text-[var(--text-primary)]">
                        <i className="fas fa-envelope mr-2 rtl:ml-2 rtl:mr-0 w-4 text-center text-blue-500"></i> {project.contactEmail}
                      </div>
                    )}
                    {project.contactPhone && (
                      <div className="flex items-center text-[var(--text-primary)] mt-2">
                        <i className="fas fa-phone mr-2 rtl:ml-2 rtl:mr-0 w-4 text-center text-emerald-500"></i> <span dir="ltr">{project.contactPhone}</span>
                      </div>
                    )}
                  </div>
                )}
                {(project.contactEmail || project.contactPhone) && isGuest && (
                  <div className="mb-4 text-center text-xs font-bold text-[var(--text-secondary)] bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-glow)] border-dashed">
                     <i className="fas fa-eye-slash mb-1.5 text-[var(--text-secondary)] text-lg block opacity-50"></i>
                     {isArabic ? 'سجل دخولك لرؤية بيانات التواصل' : 'Sign in to see contact info'}
                  </div>
                )}
                {project.status === 'Verified' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center">
                    <i className="fas fa-shield-check mr-2 rtl:ml-2 rtl:mr-0"></i> {isArabic ? 'هوية وبحث موثق' : 'Identity & Research Verified'}
                  </div>
                )}
              </div>

              <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-6 rounded-2xl">
                <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-4">{isArabic ? 'المستشار الذكي للمستثمر' : 'Investor AI Advisor'}</h4>
                <p className="text-xs text-[var(--text-primary)] font-medium mb-3">
                  {isArabic ? 'اسأل الذكاء الاصطناعي عن هذا المشروع' : 'Ask the AI about this project viability.'}
                </p>
                <div className="relative">
                  <input type="text" placeholder={isArabic ? "مثال: ما هي المخاطر التقنية؟" : "E.g. What are the policy risks?"} className="w-full bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-emerald-500" />
                  <button className="absolute right-2 rtl:left-2 rtl:right-auto top-2 w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <i className="fas fa-magic text-[10px]"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

