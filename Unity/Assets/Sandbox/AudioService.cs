using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class AudioService
{
    ObjectService objectService = null;
    IDictionary<int, AudioClip> AudioSourceMap = new Dictionary<int, AudioClip>();
    IDictionary<string, int> AudioSourceNameIdMap = new Dictionary<string, int>();

    private int AudioSourceNextId = 0;

    public AudioService (ObjectService objectService)
    {
        this.objectService = objectService;
    }

    /// Sample
    /// var id = audioService.GetAudioByName("music");
    /// audioService.CreateAudioObjectWithAudioSource(id);
    public int GetAudioByName(string name) 
    {
        if (AudioSourceNameIdMap.ContainsKey(name)) {
            return AudioSourceNameIdMap[name];
        }
        AudioClip clip = Resources.Load<AudioClip>(name);
        int id = AudioSourceNextId;
        AudioSourceMap.Add(id, clip);
        AudioSourceNextId += 1;
        return id;
    }

    public IEnumerator<UnityWebRequestAsyncOperation> loadAudioByUrl(string url, Action<int> callback)
    {
        using (UnityWebRequest www = UnityWebRequestMultimedia.GetAudioClip(url, AudioType.MPEG))
        {
            yield return www.SendWebRequest();
            if (www.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(www.error);
            }
            else
            {

                var clip = DownloadHandlerAudioClip.GetContent(www);
                int id = AudioSourceNextId;
                AudioSourceMap.Add(id, clip);
                AudioSourceNextId += 1;
                callback(id);
            }
        }
    }
    public int CreateAudioObjectWithAudioSource(int id)
    {
      var source = AudioSourceMap[id];
      Debug.Log(source);
      if (source) {
        var obj = new GameObject();
        var unitySource = obj.AddComponent<AudioSource>();
        unitySource.clip = source;
        unitySource.Play();
        return objectService.RegisterGameObject(obj);
      } else {
        return -1;
      }
    }
}