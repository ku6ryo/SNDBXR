# Supported platforms
- Desktop Mac
- Desktop Windows
- WebGL
- Android

# Develop

## Required Packages
- WasmerSharp : Included as a submodule in Assets/WasmerSharp. Make sure that it is synced. Remove Tests directory entirely in WasmerSharp.
- glTF loader: Install [UniVRM](https://github.com/vrm-c/UniVRM) by downloading unitypackage from the repository.
- External Dependency Manager for Unity : Android only. Needs for resolving dependencies of Kotlin based native plugins. See the sesion below.

# Settings
In `/Assets/Sndbxr/SandboxManager.cs` set a compiled WASM file URL generated in the editor server to `INITIAL_SANDBOX_WASM_URL` static property.
SandboxManger creates a sandbox and run WASM file in it.

# External Dependency Manager for Unity
Only required for Android build.
Get a unitypackage of Unity Jar Resolver from following repo and install. https://github.com/googlesamples/unity-jar-resolver

The file is included in the source code files. Download on the page of the latest package. e.g. https://github.com/googlesamples/unity-jar-resolver/blob/master/external-dependency-manager-1.2.165.unitypackage

Run [Assets] -> [External Dependency Manager] -> [Android Resolver] -> [Resolve]

# Notes
Stopped using cs-wasm because class clause in AssemblyScript cannot be used on cs-wasm VM.
