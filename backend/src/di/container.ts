import "reflect-metadata";
import { Container } from "inversify";
import { mappersContainer } from "./modules/mappers.container";
import { repositoriesContainer } from "./modules/repositories.container";
import { servicesContainer } from "./modules/services.container";
import { useCasesContainer } from "./modules/usecases.container";
import { controllersContainer } from "./modules/controllers.container";

const container = new Container();

// Load modules synchronously (Inversify v7+ uses loadSync for synchronous binding)
container.loadSync(mappersContainer);
container.loadSync(repositoriesContainer);
container.loadSync(servicesContainer);
container.loadSync(useCasesContainer);
container.loadSync(controllersContainer);

export { container };
