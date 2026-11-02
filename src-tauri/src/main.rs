// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DesktopSystemInfo {
    pub version: &'static str,
    pub platform: &'static str,
    pub airgapped: bool,
    pub zero_telemetry: bool,
}

#[tauri::command]
fn get_desktop_system_info() -> DesktopSystemInfo {
    DesktopSystemInfo {
        version: "1.2.3",
        platform: "windows-x64",
        airgapped: true,
        zero_telemetry: true,
    }
}

/// Spawns the user's default system browser (Chrome/Edge/Firefox) from native Windows OS
/// without relying on Webview2 internal navigation or external crates.
#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("http://") && !url.starts_with("https://") && !url.starts_with("mailto:") {
        return Err("Invalid protocol: only http, https, and mailto are permitted".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        std::process::Command::new("rundll32")
            .arg("url.dll,FileProtocolHandler")
            .arg(&url)
            .creation_flags(CREATE_NO_WINDOW)
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(())
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(())
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(())
    }
    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        Ok(())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_desktop_system_info,
            open_external_url
        ])
        .run(tauri::generate_context!())
        .expect("error while running FormatPulse native desktop application");
}

