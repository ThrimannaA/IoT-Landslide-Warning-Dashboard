// import { Outlet, Link, useLocation } from "react-router-dom";
// import { Bell } from "lucide-react";
// import { useEffect, useState } from "react";

// const navItems = [
//   { path: "/", label: "Overview", icon: "◈" },
//   { path: "/sensors", label: "Sensor Detail", icon: "◉" },
//   { path: "/alerts", label: "Alert Log", icon: "⚠" },
//   { path: "/reports", label: "Reports", icon: "▦" },
// ];

// export function DashboardLayout() {
//   const location = useLocation();
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const getPageTitle = () => {
//     switch (location.pathname) {
//       case "/":
//         return "LIVE OVERVIEW";
//       case "/sensors":
//         return "SENSOR DETAIL";
//       case "/alerts":
//         return "ALERT LOG";
//       case "/reports":
//         return "REPORTS & COMPLIANCE";
//       default:
//         return "LIVE OVERVIEW";
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden" style={{ 
//       backgroundColor: 'var(--bg)',
//       color: 'var(--text)',
//       fontFamily: 'Barlow, sans-serif'
//     }}>
//       {/* Sidebar */}
//       <aside className="w-[200px] h-full flex flex-col" style={{ 
//         backgroundColor: 'var(--bg2)',
//         borderRight: '1px solid var(--border)'
//       }}>
//         {/* Logo */}
//         <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
//           <div style={{ 
//             fontFamily: 'Barlow Condensed, sans-serif',
//             fontSize: '13px',
//             fontWeight: 700,
//             color: 'var(--amber)',
//             letterSpacing: '0.08em'
//           }}>
//             SITESENSE
//           </div>
//           <div style={{
//             fontSize: '9px',
//             color: 'var(--muted)',
//             marginTop: '2px',
//             letterSpacing: '0.05em'
//           }}>
//             EARLY WARNING SYSTEM
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-2 py-4">
//           <div style={{
//             fontSize: '9px',
//             color: 'var(--muted)',
//             fontWeight: 600,
//             letterSpacing: '0.1em',
//             marginBottom: '8px',
//             paddingLeft: '10px'
//           }}>
//             MAIN
//           </div>
//           {navItems.map((item) => {
//             const isActive = item.path === "/" 
//               ? location.pathname === "/" 
//               : location.pathname.startsWith(item.path);
            
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg transition-all"
//                 style={{
//                   height: '36px',
//                   fontSize: '12px',
//                   fontWeight: 500,
//                   backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
//                   color: isActive ? 'var(--amber)' : 'var(--text)',
//                   borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
//                 }}
//               >
//                 <span>{item.icon}</span>
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Status Block */}
//         <div className="px-4 py-3 border-t" style={{ 
//           borderColor: 'var(--border)',
//           fontSize: '10px'
//         }}>
//           <div className="flex items-center gap-2 mb-2" style={{
//             fontFamily: 'Share Tech Mono, monospace'
//           }}>
//             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--green)' }} />
//             <span style={{ color: 'var(--green)' }}>LIVE — 4 SENSORS</span>
//           </div>
//           <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>
//             Site: Colombo Block-C
//           </div>
//           <div style={{ 
//             color: 'var(--muted)',
//             fontFamily: 'Share Tech Mono, monospace'
//           }}>
//             Updated: {currentTime.toTimeString().slice(0, 8)}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col h-full overflow-hidden">
//         {/* Topbar */}
//         <header className="h-[52px] flex items-center justify-between px-6" style={{
//           backgroundColor: 'var(--bg2)',
//           borderBottom: '1px solid var(--border)'
//         }}>
//           <h1 style={{
//             fontFamily: 'Barlow Condensed, sans-serif',
//             fontSize: '18px',
//             fontWeight: 700,
//             letterSpacing: '0.05em'
//           }}>
//             {getPageTitle()}
//           </h1>

//           <div className="flex items-center gap-4">
//             <div className="px-3 py-1 rounded" style={{
//               backgroundColor: 'var(--bg3)',
//               border: '1px solid var(--border)',
//               fontSize: '11px',
//               fontFamily: 'Share Tech Mono, monospace',
//               color: 'var(--muted)'
//             }}>
//               ESP32 · MQTT · 5s interval
//             </div>

//             <div className="relative">
//               <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
//                 backgroundColor: 'rgba(239, 68, 68, 0.1)',
//                 border: '1px solid var(--red)'
//               }}>
//                 <Bell size={16} style={{ color: 'var(--red)' }} />
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{
//                 backgroundColor: 'var(--red)',
//                 fontSize: '9px',
//                 fontWeight: 600
//               }}>
//                 3
//               </div>
//             </div>
//           </div>
//         </header>
//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto p-5" style={{
//           backgroundColor: 'var(--bg)',
//           overflowY: 'auto',  // Ensure vertical scrolling
//           height: 'calc(100vh - 52px)'  // Subtract header height
//         }}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }






import { Outlet, Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Chatbot } from "./Chatbot"; 

const navItems = [
  { path: "/", label: "Overview", icon: "◈" },
  { path: "/sensors", label: "Sensor Detail", icon: "◉" },
  { path: "/alerts", label: "Alert Log", icon: "⚠" },
  { path: "/reports", label: "Reports", icon: "▦" },
  { path: "/ml-predictions", label: "ML Predictions", icon: "🧠" }, 
];

export function DashboardLayout() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "LIVE OVERVIEW";
      case "/sensors":
        return "SENSOR DETAIL";
      case "/alerts":
        return "ALERT LOG";
      case "/reports":
        return "REPORTS & COMPLIANCE";
      default:
        return "LIVE OVERVIEW";
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'Barlow, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '200px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg2)',
        borderRight: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ 
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--amber)',
            letterSpacing: '0.08em'
          }}>
            SITESENSE
          </div>
          <div style={{
            fontSize: '9px',
            color: 'var(--muted)',
            marginTop: '2px',
            letterSpacing: '0.05em'
          }}>
            EARLY WARNING SYSTEM
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 8px' }}>
          <div style={{
            fontSize: '9px',
            color: 'var(--muted)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            marginBottom: '8px',
            paddingLeft: '10px'
          }}>
            MAIN
          </div>
          {navItems.map((item) => {
            const isActive = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  height: '36px',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  color: isActive ? 'var(--amber)' : 'var(--text)',
                  borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Block */}
        <div style={{ 
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontFamily: 'Share Tech Mono, monospace' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--green)', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'var(--green)' }}>LIVE — 4 SENSORS</span>
          </div>
          <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>
            Site: Colombo Block-C
          </div>
          <div style={{ 
            color: 'var(--muted)',
            fontFamily: 'Share Tech Mono, monospace'
          }}>
            Updated: {currentTime.toTimeString().slice(0, 8)}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Topbar */}
        <header style={{
          height: '52px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: 'var(--bg2)',
          borderBottom: '1px solid var(--border)'
        }}>
          <h1 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            margin: 0
          }}>
            {getPageTitle()}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '4px 12px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg3)',
              border: '1px solid var(--border)',
              fontSize: '11px',
              fontFamily: 'Share Tech Mono, monospace',
              color: 'var(--muted)'
            }}>
              ESP32 · MQTT · 5s interval
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--red)'
              }}>
                <Bell size={16} style={{ color: 'var(--red)' }} />
              </div>
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--red)',
                fontSize: '9px',
                fontWeight: 600
              }}>
                3
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'var(--bg)',
          padding: '20px'
        }}>
          <Outlet />

          <div style={{ 
            fontSize: 9, 
            color: 'var(--muted)', 
            textAlign: "center", 
            padding: "12px 16px",
            borderTop: "1px solid var(--border)",
            marginTop: 24
          }}>
            <div>
              © {new Date().getFullYear()} SiteSense - Landslide Early Warning System
            </div>
            <div style={{ marginTop: 4, fontSize: 8, opacity: 0.7 }}>
              Version 2.0
            </div>
          </div>

        </main>
      </div>
      <Chatbot />
    </div>
  );
}