using System.Collections.Generic;
using UnityEngine;

public class MaterialService
{
    IDictionary<int, Material> MaterialMap = new Dictionary<int, Material>();

    int MaterialNextId = 0;

    public MaterialService()
    {
    }

    public int GetMaterialId(Material material)
    {
        var enumerator = MaterialMap.GetEnumerator();
        while (enumerator.MoveNext())
        {
            if (enumerator.Current.Value == material)
            {
                return enumerator.Current.Key;
            }
        }
        return -1;
    }
    /*
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
    */
    public int RegisterMaterial(Material material)
    {
        var id = MaterialNextId;
        MaterialMap.Add(id, material);
        MaterialNextId += 1;
        return id;
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