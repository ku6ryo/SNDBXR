using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.IO;


public class Sandbox : MonoBehaviour
{
    #if UNITY_EDITOR
    ConnectorWasmerSharp connector = null;
    #elif UNITY_WEBGL
    ConnectorWebGL connector = null;
    #elif UNITY_ANDROID
    ConnectorWasmerSharp connector = null;
    #elif UNITY_STANDALONE_WIN
    ConnectorWasmerSharp connector = null;
    #elif UNITY_STANDALONE_OSX
    ConnectorWasmerSharp connector = null;
    #else
    ConnectorDummy connector = new ConnectorDummy();
    #endif

    bool Connected = false;

    ObjectService objectService = null;
    AudioService audioService = null;

    GltfService gltfService = null;

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

    public void Connect ()
    {
      Connected = true;
    }

    public void Disconnect ()
    {
      Connected = false;
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
    public int ExecI_II_V(int funcId, int i0, int i1, Action listener)
    {
        switch(funcId)
        {
            case SET_OBJECT_EVENT_LISTENER:
                return objectService.SetObjectEventListener(i0, i1, listener);
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
                  connector.OnGltfLoaded(loaderId, objectId);
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
    public Vector3? ExecV3_I(int funcId, int i1)
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
        connector = new ConnectorWasmerSharp(this);
        objectService = new ObjectService(this.gameObject.name);
        audioService = new AudioService(objectService);
        gltfService = new GltfService(objectService);
    }

    void Start()
    {
        Debug.Log("start");
        string url = "http://192.168.1.5:8080/scripting/build/untouched.wasm";
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            MemoryStream stream = new MemoryStream();
            stream.Write(req.downloadHandler.data, 0, req.downloadHandler.data.Length);
            stream.Seek(0, SeekOrigin.Begin);
            var wasm = stream.ToArray();
            connector.Load(wasm);
            Connect();
            connector.Start();
            /*
            StartCoroutine(audioService.loadAudioByUrl("https://www.bensound.com/bensound-music/bensound-ukulele.mp3", (id) => {
                audioService.CreateAudioObjectWithAudioSource(id);
            }));
            */
            /*
            gltfService.loadByUrl("https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb", (id) => {
                Debug.Log(id);
            });
            */
        };
    }
    void Update()
    {
      if (Connected) {
        connector.Update();
      }
    }
}
