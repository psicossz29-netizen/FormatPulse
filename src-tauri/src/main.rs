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
        version: "1.2.2",
        platform: "windows-x64",
        airgapped: true,
        zero_telemetry: true,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_desktop_system_info])
        .run(tauri::generate_context!())
        .expect("error while running FormatPulse native desktop application");
}
