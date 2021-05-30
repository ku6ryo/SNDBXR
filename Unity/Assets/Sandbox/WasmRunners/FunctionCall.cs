using UnityEngine;
namespace Sndbxr {
    public class FunctionCall
    {
        public class ValuePack
        {
          public static int I32 = 1;
          public static int F32 = 2;
          int type;
          int i32 = 0;
          float f32 = 0;

          public ValuePack(int value) {
              type = I32;
              i32 = value;
          }
          public ValuePack(float value) {
              type = F32;
              f32 = value;
          }

          public int GetValueType() {
              return type;
          }

          public int GetInt() {
              return i32;
          }
          public void SetInt(int value)
          {
              i32 = value;
          }
          public float GetFloat() {
              return f32;
          }

          public void SetFloat(float value)
          {
              f32 = value;
          }
        }

        int funcId;
        ValuePack[] args;
        ValuePack[] returns;

        public FunctionCall(int funcId, int numArgs, int numReturns)
        {
            this.funcId = funcId;
            this.args = new ValuePack[numArgs];
            this.returns = new ValuePack[numReturns];
        }

        public string CreateValueSetSign(ValuePack[] values)
        {
            var sign = "";
            foreach (var item in values)
            {
                var type = item.GetValueType();
                if (type == FunctionCall.ValuePack.I32) {
                    sign += "i";
                }
                if (type == FunctionCall.ValuePack.F32) {
                    sign += "f";
                }
            }
            return sign;
        }

        public string GetFuncSign()
        {
            return this.CreateValueSetSign(this.returns) + "_" + this.CreateValueSetSign(this.args);
        }
        public int GetFuncId()
        {
            return funcId;
        }

        public ValuePack[] GetArgs()
        {
            return args;
        }

        public ValuePack[] GetReturns()
        {
            return returns;
        }
    }
}