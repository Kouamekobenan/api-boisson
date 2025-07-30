<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# 📦 MonDepot — Application de Gestion de Livraison

**MonDepot** est une application web moderne conçue pour automatiser la gestion des produits, des fournisseurs, des livraisons et des commandes dans un dépôt. Elle facilite le suivi du stock en temps réel, la création de commandes, la facturation et la gestion des utilisateurs avec des rôles spécifiques.

---

## 🚀 Fonctionnalités Clés

- 📦 Gestion des **produits** : seuil critique, prix d'achat, prix de vente, stock
- 🏷️ Catégorisation des produits
- 🤝 Gestion des **fournisseurs**
- 📈 Suivi des **mouvements de stock** (entrée, sortie, retour)
- 🚚 Gestion des **livraisons** (suivi, retours, quantités livrées)
- 🧍‍♂️ Gestion des **livreurs**
- 🧾 Création de **commandes** et génération de **factures**
- 🔐 Authentification avec gestion de **rôles** (`ADMIN`, `MANAGER`, `DELIVERY_PERSON`)
- 📊 Tableaux de bord et statistiques

---

## 🧱 Stack Technique

| Composant        | Technologie                                   |
| ---------------- | --------------------------------------------- |
| Frontend         | Next.js + Tailwind CSS                        |
| Backend          | NestJS                                        |
| Base de données  | PostgreSQL                                    |
| ORM              | Prisma                                        |
| Authentification | JWT + Guards NestJS                           |
| Hébergement      | Vercel (Frontend), Railway / Render (Backend) |

---

## 🔧 Modèle de données (Prisma)

Voici les principales entités de la base :

### 🛒 Product

- `name`, `description`, `price`, `stock`, `criticalStockThreshold`
- Lié à : `Supplier`, `CategoryProduct`, `StockMovement`, `DeliveryProduct`, `OrderItem`

### 🏷️ CategoryProduct

- `name` unique
- Plusieurs `Product`

### 🚚 Delivery & DeliveryProduct

- `Delivery`: avec `status`, `deliveryPerson`, `createdAt`
- `DeliveryProduct`: lien `product`, `quantity`, `returnedQuantity`

### 🏭 Supplier

- `name`, `email`, `phone`
- Un fournisseur peut avoir plusieurs produits

### 🔁 StockMovement

- `type`: `ENTRY`, `EXIT`, `RETURN`
- Lié à un `product` et éventuellement une `delivery`

### 🧍‍♂️ DeliveryPerson

- `name`, `phone`
- Affecté à plusieurs `Delivery`

### 👤 User

- `email`, `password`, `role` (`ADMIN`, `MANAGER`, `DELIVERY_PERSON`)
- Crée des `Order`

### 🧾 Order & OrderItem

- `Order`: contient plusieurs `OrderItem`, lié à un `User`
- `OrderItem`: quantité, prix unitaire, prix total

### 📑 Invoice

- Liée à une `Order`, contient le `totalPrice`

---

## 🛠️ Installation et Lancement

### 1. Cloner le projet

````bash
git clone https://github.com/Kouamekobenan/api-boisson.git
cd my-backend


[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
````

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

## ACCES DE MANAGER

PASSWORD: ``NONO12

EMAIL: `` nono12@gmail.com

## Faire migrer la BD sur Render

pg_dump -U postgres -d domini -f dump.sql
