import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Initialize Firebase
let app: any;
let auth: any;
let storage: any;

/**
 * 安全地获取环境变量，并提供详细的调试信息
 */
const getFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
  };

  console.group("🔥 Firebase 环境变量诊断");
  Object.entries(config).forEach(([key, value]) => {
    const isSet = !!value && value !== "undefined" && value !== "null" && value.length > 0;
    const type = typeof value;
    // 遮罩 API Key 以保安全，但显示长度和前几位用于确认
    const displayValue = isSet 
      ? (key === 'apiKey' ? `${value.substring(0, 6)}... (len: ${value.length})` : value)
      : "❌ 未设置 (MISSING)";
    
    console.log(
      `%c${key}: %c${isSet ? '✅' : '❌'} %c(${type}) %c${displayValue}`,
      "color: #ffa600; font-weight: bold;",
      isSet ? "color: #00ff00;" : "color: #ff0000;",
      "color: #888;",
      "color: #fff;"
    );
  });
  console.groupEnd();

  return config;
};

const firebaseConfig = getFirebaseConfig();

try {
  const { apiKey, appId } = firebaseConfig;
  
  // 严格验证核心参数
  const isConfigValid = 
    typeof apiKey === 'string' && apiKey.length > 10 && 
    typeof appId === 'string' && appId.length > 10;

  if (isConfigValid) {
    console.log("🚀 Firebase: 配置验证通过，正在尝试初始化...");
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("✅ Firebase: 初始化成功");
  } else {
    throw new Error("Firebase 配置无效：apiKey 或 appId 缺失或过短。");
  }
} catch (error: any) {
  console.error("❌ Firebase 初始化失败:", error.message || error);
  
  // 提供 Mock 对象以防止应用崩溃
  auth = { 
    onAuthStateChanged: (cb: any) => { 
      console.warn("⚠️ Firebase Auth: 使用 Mock 模式，onAuthStateChanged 将始终返回 null");
      cb(null); 
      return () => {}; 
    },
    signOut: async () => { console.warn("⚠️ Firebase Auth: 使用 Mock 模式，signOut 无效"); },
    signInWithPopup: async () => {
      console.error("❌ Firebase Auth: 未正确配置，无法执行登录操作。");
      throw new Error("Firebase 未初始化，请检查环境变量。");
    }
  };
  storage = {};
}

// Initialize Analytics
let analytics: any = null;
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, storage, analytics };
