using UnityEngine;

public class Sandbox : MonoBehaviour
{

    ConnectorAbstract connector = null;

    bool Running = false;

    ObjectService objectService = null;
    AudioService audioService = null;
    GltfService gltfService = null;
    SkyService skyService = null;

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

    int id = -1;
    string wasmUrl = null;
    public void SetLoadParameters(int sandboxId, string url)
    {
        id = sandboxId;
        wasmUrl = url;
    }

    public int ExecI_I(int funcId, int i0) {
        switch(funcId)
        {
            case GET_MATERIAL_OF_OBJECT:
                return objectService.GetMaterialByObjectId(i0);
            case CREATE_PRIMITIVE_OBJECT:
                return objectService.CreatePrimitiveObject((PrimitiveTypeEnum) i0);
            default:
                throw new System.Exception("No function to match");
        }
    }
    public int ExecI_II(int funcId, int i0, int i1)
    {
        switch(funcId)
        {
            case SET_OBJECT_EVENT_LISTENER:
                return objectService.SetObjectEventListener(i0, i1, () => {
                    connector.SandboxExecV_II(SANDBOX_ON_OBJECT_EVENT, i1, i0);
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
                return objectService.GetObjectByName(str);
            case GET_MATERIAL_ID_BY_NAME:
                return objectService.GetMaterialByName(str);
            case LOAD_GLTF:
                return gltfService.loadByUrl(str, (loaderId, objectId) => {
                    connector.SandboxExecV_II(SANDBOX_ON_GLTF_LOADED, loaderId, objectId);
                });
            case LOAD_SKY:
                return skyService.loadByUrl(str, (loaderId) => {
                    connector.SandboxExecV_I(SANDBOX_ON_SKY_LOADED, loaderId);
                });
            default:
                throw new System.Exception("No function to match");
        }
    }
    public int ExecI_IV3(int funcId, int i1, float f1, float f2, float f3)
    {
        switch(funcId)
        {
            case SET_OBJECT_POSITION:
                return objectService.SetObjectPosition(i1, new Vector3(f1, f2, f3));
            case SET_OBJECT_SCALE:
                return objectService.SetObjectScale(i1, new Vector3(f1, f2, f3));
            default:
                throw new System.Exception("No function to match");
        }
    }
    public int ExecI_IV4(int funcId, int i1, float f1, float f2, float f3, float f4)
    {
        switch(funcId)
        {
            case SET_MATERIAL_COLOR:
                return objectService.SetMaterialColor(i1, f1, f2, f3, f4);
            default:
                throw new System.Exception("No function to match");
        }
    }
    public Vector3 ExecV3_I(int funcId, int i1)
    {
        switch (funcId)
        {
            case GET_OBJECT_POSITION:
                return objectService.GetObjectPosition(i1);
            case GET_OBJECT_SCALE:
                return objectService.GetObjectScale(i1);
            default:
                throw new System.Exception("No function to match");
        }
    }

    ///////////////////////////////
    // Unity life cycle methods. //
    ///////////////////////////////

    void Awake()
    {
        #if UNITY_EDITOR
        connector = new ConnectorWasmerSharp(this);
        #elif UNITY_WEBGL
        connector = new ConnectorWebGL(this);
        #elif UNITY_ANDROID
        connector = new ConnectorWasmerSharp(this);
        #elif UNITY_STANDALONE_WIN
        connector = new ConnectorWasmerSharp(this);
        #elif UNITY_STANDALONE_OSX
        connector = new ConnectorWasmerSharp(this);
        #else
        connector = new ConnectorDummy();
        #endif
        objectService = new ObjectService(this.gameObject.name);
        audioService = new AudioService(objectService);
        gltfService = new GltfService(objectService);
        skyService = new SkyService();
    }

    public void OnLoadCompleted(int status) {
        if (status == 0)
        {
            this.Running = true;
            connector.Start(this.id);
            /*
            StartCoroutine(audioService.loadAudioByUrl("https://www.bensound.com/bensound-music/bensound-ukulele.mp3", (id) => {
                audioService.CreateAudioObjectWithAudioSource(id);
            }));
            */
        }
    }

    void Start()
    {
        if (wasmUrl != null)
        {
            Debug.Log("starting " + wasmUrl);
            connector.Load(id, wasmUrl);
        }
    }
    void Update()
    {
      if (Running) {
        connector.Update(this.id);
      }
    }
}
