using System;
using UnityEngine;
using UnityEngine.Networking;

public class SkyService
{
    int loaderNextId = 0;

    public int loadByUrl(string url, Action<int> callback)
    {
        var loaderId = loaderNextId;
        UnityWebRequest req = UnityWebRequestTexture.GetTexture(url);
        req.SendWebRequest().completed += operation =>
        {
            if (req.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(req.error);
            }
            else
            {
                Debug.Log("success");
                Material mat = new Material(Shader.Find("Skybox/Panoramic"));
                RenderSettings.skybox = mat;
                var tex = ((DownloadHandlerTexture) req.downloadHandler).texture;
                mat.SetTexture("_MainTex", tex);
                callback(loaderId);
            }
        };
        loaderNextId += 1;
        return loaderId;
    }
}