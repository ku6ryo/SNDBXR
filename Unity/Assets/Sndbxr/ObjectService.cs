using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Events;

public enum PrimitiveTypeEnum
{
    Cube = 0,
    Sphere = 1,
}

public class ObjectService
{
    IDictionary<int, GameObject> ObjectMap = new Dictionary<int, GameObject>();
    IDictionary<string, int> ObjectNameMap = new Dictionary<string, int>();
    IDictionary<int, UnityAction<BaseEventData>> EventListenerMap = new Dictionary<int, UnityAction<BaseEventData>>();
    // key: object id , value : listner id
    IDictionary<int, int> ObjectEventListenerMap = new Dictionary<int, int>();

    int ObjectNextId = 0;
    int EventListenerNextId = 0;
    GameObject SandboxGameObj = null;

    MaterialService MaterialService = null;

    public ObjectService(GameObject sandboxGameObj, MaterialService materialService)
    {
        this.SandboxGameObj = sandboxGameObj;
        this.MaterialService = materialService;
    }

    public GameObject GetSandboxGameObject()
    {
        if (SandboxGameObj == null) {
            throw new Exception("No sandbox GameObject");
        }
        return this.SandboxGameObj;
    }

    public int RegisterGameObject(GameObject obj)
    {
        int id = ObjectNextId;
        ObjectMap.Add(ObjectNextId, obj);
        ObjectNextId += 1;
        return id;
    }

    public int CreatePrimitiveObject(PrimitiveTypeEnum p)
    {
        var type = PrimitiveType.Cube;
        if (p == PrimitiveTypeEnum.Sphere) {
            type = PrimitiveType.Sphere;
        }
        var obj = GameObject.CreatePrimitive(type);
        obj.transform.SetParent(GetSandboxGameObject().transform);
        var renderer = obj.GetComponent<Renderer>();
        MaterialService.RegisterMaterial(renderer.material);
        return RegisterGameObject(obj);
    }

    public int GetObjectByName (string name) {
      var known = ObjectNameMap.ContainsKey(name);
      if (known) {
        return ObjectNameMap[name];
      }
      var obj = GameObject.Find(name);
      if (obj) {
        int id = ObjectNextId;
        ObjectMap.Add(ObjectNextId, obj);
        ObjectNameMap.Add(name, id);
        ObjectNextId += 1;
        return id;
      } else {
        return -1;
      }
    }

    public int SetObjectPosition(int objectId, Vector3 v)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            obj.transform.position = v;
            return 0;
        } else {
            return 1;
        }
    }

    public Vector3 GetObjectPosition(int objectId)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            return obj.transform.position;
        }
        throw new Exception("Object not found");
    }

    public int SetObjectScale(int objectId, Vector3 v)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            obj.transform.localScale = v;
            return 0;
        } else {
            return 1;
        }
    }

    public Vector3 GetObjectScale(int objectId)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            return obj.transform.localScale;
        }
        throw new Exception("Object not found");
    }

    public int SetObjectEventListener(int objectId, int type, Action listener)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            obj.AddComponent<EventTrigger>();
            EventTrigger trigger = obj.GetComponent<EventTrigger>();
            EventTrigger.Entry entry = new EventTrigger.Entry();
            entry.eventID = EventTriggerType.PointerClick;
            UnityAction<BaseEventData> callback = delegate(BaseEventData data)
            {
                listener();
            };
            entry.callback.AddListener(callback);
            trigger.triggers.Add(entry);
            var id = EventListenerNextId;
            EventListenerMap.Add(id, callback);
            ObjectEventListenerMap.Add(objectId, id);
            EventListenerNextId += 1;
            return id;
        } else {
            return -1;
        }
    }

    public int GetMaterialByObjectId(int objectId)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            var renderer = obj.GetComponent<Renderer>();
            return MaterialService.GetMaterialId(renderer.material);
        } else {
            return -1;
        }
    }
}