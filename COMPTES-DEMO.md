# Comptes de démonstration — Roomly

> Fichier généré automatiquement par `npm run db:seed`.
> Ces comptes n'existent que dans la base de données de votre ordinateur.

## Administrateur

Se connecte sur **http://localhost:3000/admin**

| Adresse e-mail | Mot de passe |
| --- | --- |
| admin@roomly.com | `admin123` |

## Propriétaires

Ils déposent des biens et consultent les réservations reçues.
Connexion sur la page d'accueil, bouton **Login**.

| Nom | Adresse e-mail | Mot de passe | Rôle |
| --- | --- | --- | --- |
| Sami Ben Salah | sami.bensalah@roomly.tn | `roomly123` | Propriétaire |
| Ines Trabelsi | ines.trabelsi@roomly.tn | `roomly123` | Propriétaire |
| Karim Jaziri | karim.jaziri@roomly.tn | `roomly123` | Propriétaire |
| Nadia Cherif | nadia.cherif@roomly.tn | `roomly123` | Propriétaire |
| Youssef Mansouri | youssef.mansouri@roomly.tn | `roomly123` | Propriétaire |
| Leila Gharbi | leila.gharbi@roomly.tn | `roomly123` | Propriétaire |

## Locataires

Ils cherchent un bien, le réservent et le paient.

| Nom | Adresse e-mail | Mot de passe | Rôle |
| --- | --- | --- | --- |
| Amine Bouazizi | amine.bouazizi@example.tn | `roomly123` | Locataire |
| Sarra Hamdi | sarra.hamdi@example.tn | `roomly123` | Locataire |
| Mehdi Khelifi | mehdi.khelifi@example.tn | `roomly123` | Locataire |
| Rania Belhaj | rania.belhaj@example.tn | `roomly123` | Locataire |
| Hatem Nasri | hatem.nasri@example.tn | `roomly123` | Locataire |
| Emna Zouari | emna.zouari@example.tn | `roomly123` | Locataire |

---

Pour repartir de zéro : `npm run db:seed -- --reset`
