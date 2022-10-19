import * as pulumi from "@pulumi/pulumi";

class testClass extends pulumi.ComponentResource {
    public readonly somethingMapVar: Map<string, string>;
  
    constructor(name: string, args?: {}, opts?: {}) {
      super("pkg:index:K8sExternalSecretsDeployments", name, args, opts);
      this.somethingMapVar = this.somethingMap();
    }
  
    public somethingMap(): Map<string, string> {
      const amap = new Map();
      amap.set('foo', 'bar');
      return amap;
    }
  
  }
  
  function testMain() {
    return new testClass(`foo-testtestest`);
    
  };
  
  //console.log(testMain().somethingMapVar)
export const someMapVar = testMain().somethingMapVar;