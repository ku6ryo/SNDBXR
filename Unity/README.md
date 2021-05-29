# Currently Supported platforms
- Desktop Mac
- Desktop Windows

# How to run Unity project
1. Please make sure that submodule Assets/WasmerSharp is synced.
2. Remove Tests directory entirely.
3. Run project on Unity Editor.

# Note
Stopped using cs-wasm because class in assembly script cannot be used on cs-wasm VM.

# Android build
Get a unity package from following repo and install. https://github.com/googlesamples/unity-jar-resolver

The file is included in the source code files. Download on the page of the latest package. e.g. https://github.com/googlesamples/unity-jar-resolver/blob/master/external-dependency-manager-1.2.165.unitypackage

Run [Assets] -> [External Dependency Manager] -> [Android Resolver] -> [Resolve]