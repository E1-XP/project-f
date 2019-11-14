import "reflect-metadata";
import { container as Container, instanceCachingFactory } from "tsyringe";

import { types } from "./types";

import { AppCore } from "./../core";
import { Helpers } from "./../helpers";
import { Model } from "./../model";
import { Router } from "./../router";
import { Initializer } from "./../initializer";

export const container = Container;

container.register(types.AppCore, {
  useFactory: instanceCachingFactory(c => c.resolve(AppCore))
});

container.register(types.Helpers, {
  useFactory: instanceCachingFactory(c => c.resolve(Helpers))
});

container.register(types.Model, {
  useFactory: instanceCachingFactory(c => c.resolve(Model))
});

container.register(types.Router, {
  useFactory: instanceCachingFactory(c => c.resolve(Router))
});

container.register(types.Initializer, {
  useFactory: instanceCachingFactory(c => c.resolve(Initializer))
});
