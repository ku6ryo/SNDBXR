using UnityEngine;

namespace Sndbxr
{
    public class Sandbox : MonoBehaviour
    {

        AbstractRunner Runner = null;
        bool Running = false;

        ObjectService ObjectService = null;
        AudioService AudioService = null;
        GltfService GltfService = null;
        SkyService SkyService = null;
        MaterialService MaterialService = null;

        const int GET_OBJECT_ID_BY_NAME = 1000;
        const int CREATE_PRIMITIVE_OBJECT = 1001;
        const int SET_OBJECT_POSITION = 1100;
        const int GET_OBJECT_POSITION = 1101;
        const int SET_OBJECT_ROTATION = 1110;
        const int GET_OBJECT_ROTATION = 1111;
        const int SET_OBJECT_SCALE = 1120;
        const int GET_OBJECT_SCALE = 1121;
        const int GET_MATERIAL_OF_OBJECT = 1200;
        const int SET_OBJECT_EVENT_LISTENER = 1300;
        const int GET_MATERIAL_ID_BY_NAME = 2000;
        const int SET_MATERIAL_COLOR = 2100;
        const int LOAD_GLTF = 3000;
        const int LOAD_SKY = 4000;

        // Function IDs of calls from Unity to WASM.
        const int SANDBOX_ON_OBJECT_EVENT = 10000;
        const int SANDBOX_ON_GLTF_LOADED = 10010;
        const int SANDBOX_ON_SKY_LOADED = 10020;

        public int id = -1;
        string wasmUrl = null;
        public void SetLoadParameters(int sandboxId, string url)
        {
            id = sandboxId;
            wasmUrl = url;
        }

        public void CallEngine32(FunctionCall call) {
            var sign = call.GetFuncSign();
            switch (sign)
            {
                case "i_i":
                    CallEngine32_i_i(call);
                    break;
                case "i_ifff":
                    CallEngine32_i_ifff(call);
                    break;
                case "i_iffff":
                    CallEngine32_i_iffff(call);
                    break;
                default:
                    break;
            }
        }

        public void CallEngine32_i_i(FunctionCall call)
        {
            var funcId = call.GetFuncId();
            var ai0 = call.GetArgs()[0].GetInt();
            var ri0 = 0;
            switch(funcId)
            {
                case GET_MATERIAL_OF_OBJECT:
                    ri0 = ObjectService.GetMaterialByObjectId(ai0);
                    break;
                case CREATE_PRIMITIVE_OBJECT:
                    ri0 = ObjectService.CreatePrimitiveObject((PrimitiveTypeEnum) ai0);
                    break;
                default:
                    Debug.LogWarning("No function to match. " + funcId);
                    // throw new System.Exception("No function to match");
                    break;
            }
            call.GetReturns()[0].SetInt(ri0);
        }
        public void CallEngine32_i_ifff(FunctionCall call)
        {
            var funcId = call.GetFuncId();
            var ai0 = call.GetArgs()[0].GetInt();
            var af0 = call.GetArgs()[1].GetFloat();
            var af1 = call.GetArgs()[2].GetFloat();
            var af2 = call.GetArgs()[3].GetFloat();
            var ri0 = 0;
            switch(funcId)
            {
                case SET_OBJECT_POSITION:
                    ri0 = ObjectService.SetObjectPosition(ai0, new Vector3(af0, af1, af2));
                    break;
                case SET_OBJECT_SCALE:
                    ri0 = ObjectService.SetObjectScale(ai0, new Vector3(af0, af1, af2));
                    break;
                default:
                    Debug.LogWarning("No function to match. " + funcId);
                    // throw new System.Exception("No function to match");
                    break;
            }
            call.GetReturns()[0].SetInt(ri0);
        }
        public void CallEngine32_i_iffff(FunctionCall call)
        {
            var funcId = call.GetFuncId();
            var ai0 = call.GetArgs()[0].GetInt();
            var af0 = call.GetArgs()[1].GetFloat();
            var af1 = call.GetArgs()[2].GetFloat();
            var af2 = call.GetArgs()[3].GetFloat();
            var af3 = call.GetArgs()[4].GetFloat();
            var ri0 = 0;
            switch(funcId)
            {
                case SET_MATERIAL_COLOR:
                    ri0 = MaterialService.SetMaterialColor(ai0, af0, af1, af2, af3);
                    break;
                default:
                    Debug.LogWarning("No function to match. " + funcId);
                    // throw new System.Exception("No function to match");
                    break;
            }
            call.GetReturns()[0].SetInt(ri0);
        }

        ///////////////////////////////
        // Unity life cycle methods. //
        ///////////////////////////////

        void Awake()
        {
            #if UNITY_EDITOR
            #elif UNITY_WEBGL
            Runner = new WebGLRunner(this);
            #elif UNITY_ANDROID
            Runner = new AndroidRunner(this);
            #else
            Runner = new DummyRunner();
            #endif
            MaterialService = new MaterialService();
            ObjectService = new ObjectService(
                this.gameObject,
                MaterialService
            );
            AudioService = new AudioService(ObjectService);
            GltfService = new GltfService(ObjectService);
            SkyService = new SkyService();
        }

        public void OnLoadCompleted(int status) {
            if (status == 0)
            {
                this.Running = true;
                #if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
                WasmerSharpRunner.Start();
                #endif
                if (Runner != null) {
                    Runner.Start(this.id);
                }
            }
        }

        void Start()
        {
            if (wasmUrl != null)
            {
                Debug.Log("starting " + wasmUrl);
                #if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
                WasmerSharpRunner.Load(this, wasmUrl);
                #endif
                if (Runner != null) {
                    Runner.Load(id, wasmUrl);
                }
            }
        }
        void Update()
        {
            if (Running) {
                #if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
                WasmerSharpRunner.Update();
                #endif
                if (Runner != null) {
                    Runner.Update(this.id);
                }
            }
        }


    ///////////////// The followings are legacy code. /////////////////////////

        public int ExecI_II(int funcId, int i0, int i1)
        {
            switch(funcId)
            {
                case SET_OBJECT_EVENT_LISTENER:
                    return ObjectService.SetObjectEventListener(i0, i1, () => {
                        // connector.SandboxExecV_II(SANDBOX_ON_OBJECT_EVENT, i1, i0);
                    });
                default:
                    throw new System.Exception("No function to match");
            }
        }
        public int ExecI_S(int funcId, string str)
        {
            switch(funcId)
            {
                case GET_OBJECT_ID_BY_NAME:
                    return ObjectService.GetObjectByName(str);
                case LOAD_GLTF:
                    return GltfService.loadByUrl(str, (loaderId, objectId) => {
                        // connector.SandboxExecV_II(SANDBOX_ON_GLTF_LOADED, loaderId, objectId);
                    });
                case LOAD_SKY:
                    return SkyService.loadByUrl(str, (loaderId) => {
                        // connector.SandboxExecV_I(SANDBOX_ON_SKY_LOADED, loaderId);
                    });
                default:
                    throw new System.Exception("No function to match");
            }
        }
    }
}