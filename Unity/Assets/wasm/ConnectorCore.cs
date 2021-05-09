using UnityEngine;
using System.Collections.Generic;

enum PrimitiveTypeEnum
{
    Cube = 0,
    Plane = 1,
    Sphere = 2,
}


public class ConnectorCore : MonoBehaviour
{
    #if UNITY_EDITOR
    ConnectorDummy connector = new ConnectorDummy();
    #elif UNITY_WEBGL
    ConnectorWebGL connector = new ConnectorWebGL();
    #else
    ConnectorDummy connector = new ConnectorDummy();
    #endif

    IDictionary<int, GameObject> ObjectMap = new Dictionary<int, GameObject>();
    int ObjectCount = 0;


    bool Connected = false;


    float x = 0;

    GameObject createPrimitive(PrimitiveTypeEnum p) {
      var type = PrimitiveType.Cube;
      if (p == PrimitiveTypeEnum.Cube) {
        type = PrimitiveType.Cube;
      }
      var obj = GameObject.CreatePrimitive(type);
      return obj;
    }

    public int GetObjectByName (string name) {
      var obj = GameObject.Find(name);
      if (obj) {
        int id = ObjectCount;
        ObjectMap.Add(ObjectCount, obj);
        ObjectCount += 1;
        return id;
      } else {
        return -1;
      }
    }

    public int SetObjectPosition(int objectId, float x, float y, float z) {
      GameObject obj = ObjectMap[objectId];
      if (obj) {
        obj.transform.position = new Vector3(x, y, z);
        return 0;
      } else {
        return 1;
      }
    }

    public int SetObjectEventListener(int objectId, int type) {
      GameObject obj = ObjectMap[objectId];
      if (obj) {
        return 0;
      } else {
        return -1;
      }
    }

    public void Connect ()
    {
      Connected = true;
    }

    public void Disconnect ()
    {
      Connected = false;
    }

    ///////////////////////////////
    // Unity life cycle methods. //
    ///////////////////////////////

    void Start()
    {
        Debug.Log("start");
        connector.Init(this);
        connector.Test();
    }
    void Update()
    {
      if (Connected) {
        connector.Update();
      }
      /*
        int id = this.GetObjectByName("Cube");
        this.SetObjectPosition(id, x, 0, 0);
        x = x + 0.01f;
        */
    }
}
