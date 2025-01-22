import { ModuleRef } from "@nestjs/core";

export function debugIoCContainer(moduleRef: ModuleRef) {
  // Get all providers
  const container = (moduleRef as any)["container"];
  const modules = container.getModules();

  modules.forEach((module, moduleKey) => {
    console.log(`\nModule: ${moduleKey}`);

    // Get providers
    const providers = module.providers;
    providers.forEach((provider, providerKey) => {
      console.log(`  Provider: ${providerKey}`);
    });
  });
}
