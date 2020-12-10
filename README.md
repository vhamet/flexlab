# Flexlab chat


## Usage
Se placer à la racine et exécuter la commande suivante.

```python
docker-compose up
```
Le chat sera accessible sur http://localhost:3000/

## Code structure
Le code est séparé en deux parties: 
 * le server avec l'app, les models et les types/resolvers graphql
 * le client avec l'application (pages & components), un HOC de configuration apollo (graphql) et un context gérant l'authentification
