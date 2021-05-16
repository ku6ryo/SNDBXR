using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class GltfService
{
    ObjectService objectService = null;

    int loaderNextId = 0;

    public GltfService (ObjectService objectService)
    {
        this.objectService = objectService;
    }

    public int loadByUrl(string url, Action<int, int> callback)
    {
        int loaderId = loaderNextId;
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += async operation =>
        {
            if (req.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(req.error);
            }
            else
            {
                var bytes = req.downloadHandler.data;
                var parser = new UniGLTF.GltfParser();
                var ic = new UniGLTF.ImporterContext(parser);
                ic.Parser.ParseGlb(bytes);
                await ic.LoadAsync();
                ic.ShowMeshes();
                var objectId = objectService.RegisterGameObject(ic.Root);
                ic.Root.transform.SetParent(objectService.GetSandboxGameObject().transform);
                callback(loaderId, objectId);
            }
        };
        loaderNextId += 1;
        return loaderId;
    }
}