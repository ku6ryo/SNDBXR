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
    ConnectorWebGL connector = new ConnectorWebGL();

    IDictionary<int, GameObject> ObjectMap = new Dictionary<int, GameObject>();
    int ObjectCount = 0;

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

    public int SetObjectPosition(int objectId, int x, int y, int z) {
      GameObject obj = ObjectMap[objectId];
      if (obj) {
        obj.transform.position = new Vector3(x, y, z);
        return 0;
      } else {
        return 1;
      }
    }
    void Start()
    {
        Debug.Log("start");
        connector.Init(this);
        connector.Test();
    }
    void Update()
    {
    }
}
