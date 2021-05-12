using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Events;

public enum PrimitiveTypeEnum
{
    Cube = 0,
    Plane = 1,
    Sphere = 2,
}

public class ObjectService
{
    IDictionary<int, GameObject> ObjectMap = new Dictionary<int, GameObject>();
    IDictionary<string, int> ObjectNameMap = new Dictionary<string, int>();
    IDictionary<int, UnityAction<BaseEventData>> EventListenerMap = new Dictionary<int, UnityAction<BaseEventData>>();
    // key: object id , value : listner id
    IDictionary<int, int> ObjectEventListenerMap = new Dictionary<int, int>();
    IDictionary<int, Material> MaterialMap = new Dictionary<int, Material>();
    IDictionary<string, int> MaterialNameMap = new Dictionary<string, int>();

    int MaterialCount = 0;

    int ObjectNextId = 0;
    int EventListenerCount = 0;

    string sandboxName = null;

    public ObjectService(string sandboxName)
    {
        this.sandboxName = sandboxName;
    }

    private GameObject GetSandboxGameObject()
    {
        return GameObject.Find(this.sandboxName);
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
        if (p == PrimitiveTypeEnum.Cube) {
            type = PrimitiveType.Cube;
        }
        var obj = GameObject.CreatePrimitive(type);
        obj.transform.SetParent(GetSandboxGameObject().transform);
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

    public int SetObjectPosition(int objectId, float x, float y, float z)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            obj.transform.position = new Vector3(x, y, z);
            return 0;
        } else {
            return 1;
        }
    }

    public Vector3? GetObjectPosition(int objectId)
    {
        GameObject obj = ObjectMap[objectId];
        if (obj) {
            return obj.transform.position;
        }
        return null;
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
            var id = EventListenerCount;
            EventListenerMap.Add(id, callback);
            ObjectEventListenerMap.Add(objectId, id);
            EventListenerCount += 1;
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
          var material = renderer.material;
          var known = MaterialNameMap.ContainsKey(material.name);
          if (known) {
            return MaterialNameMap[material.name];
          } else {
            var id = MaterialCount;
            MaterialMap.Add(id, material);
            MaterialNameMap.Add(material.name, id);
            MaterialCount += 1;
            return id;
          }
        } else {
          return -1;
        }
    }
    public int GetMaterialByName(string name) 
    {
        if (MaterialNameMap.ContainsKey(name)) {
            return MaterialNameMap[name];
        }
        Material material = (Material) Resources.Load(name, typeof(Material));
        if (material) {
          var id = MaterialCount;
          MaterialMap.Add(id, material);
          MaterialNameMap.Add(name, id);
          MaterialCount += 1;
          return id;
        } else {
          return -1;
        }
    }

    public int SetMaterialColor(int materialId, float r, float g, float b, float a)
    {
        var material = MaterialMap[materialId];
        if (material) {
            material.color = new Color(r, g, b, a);
            return 1;
        } else {
            return -1;
        }
    }
}