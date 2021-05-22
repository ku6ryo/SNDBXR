# SNDBXR
The portable scripting sandbox for user generated content 3D platforms.

# Motivations
3D UGC platforms has a same problem. They want to provide scripting environment for their users
to enpower expressions of users on their platform. However, there are many problems.
For technical, poerformance and security reasons, 3D game engines like Unity, Unreal do not provide
dynamic scripting environment. This project overcomes the challenge with WebAssembly.

# Supported engines
Currently only Unity is supported. 

# Directory structure
- Unity: Unity project that implements the sandbox environment.
- api: APIs for scripting in WASM environment. 
- compiler: Compiler / Playground server