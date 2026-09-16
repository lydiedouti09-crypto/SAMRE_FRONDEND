                     Cahier des charges
I. Besoins fonctionnels
1. Côté Testeurs
•	Gestion de compte
•	Créer un compte 
•	Se connecter / se déconnecter 
•	Modifier ses informations personnelles 
•	Profil du consultant 
•	Consulter son historique d'activités
•	Consulter les missions disponibles 
•	Consulter les détails d'une mission
•	Accepter les conditions de la mission
•	Suivre les étapes de la mission 
•	Consulter les instructions quotidiennes 
•	Consulter les références ou codes générés
•	Saisir le résultat demandé 
•	Valider une étape de la mission
•	Consulter l'état de sa mission 
•	Consulter son historique 
•	Consulter les informations relatives à sa rémunération
2. Gestion des missions (Admin)
•	Créer une mission 
•	définir les informations de la mission 
•	définir les étapes à réaliser 
•	Ajouter les instructions de chaque étape 
•	Ajouter l'application à tester 
•	Ajouter le lien vers l'application 
•	définir la durée de la mission 
•	définir les conditions de réalisation de la mission 
•	Générer les références ou codes nécessaires à la validation 
•	Associer les références aux différentes étapes de la mission 
•	définir les validations quotidiennes 
•	Suivre la progression du testeur 
•	Suivre les étapes réalisées et non réalisées 
•	Consulter l'état de validation de la mission 
•	Déterminer si la mission est complète ou non 
•	définir les conditions de rémunération de la mission

3. Côté plateforme (back-office)
•	Gérer les utilisateurs 
•	Gérer les testeurs 
•	Créer une mission 
•	Modifier une mission 
•	Activer / désactiver une mission 
•	Gérer les applications à tester 
•	définir les étapes d'une mission 
•	Générer les références 
•	Suivre les validations quotidiennes 
•	Consulter les missions en cours 
•	Consulter les missions terminées 
•	Identifiant des missions non validées 
•	Consulter les résultats des tests 
•	Gérer les paiements 
II. Déroulement d'une mission
1. Acceptation du contrat
Le testeur doit prendre connaissance du contrat et accepter les conditions prévues sur la plateforme avant de pouvoir commencer une mission.
2. Sélection d'une mission
Le testeur sélectionne une mission parmi les missions disponibles.
3. Présentation des étapes
Chaque mission présente clairement les différentes étapes que le testeur doit réaliser.
4. Réalisation du test
Le testeur suit les instructions fournies par la plateforme et utilise l'application concernée.

5. Génération quotidienne d'une référence
•	Générer automatiquement une référence pour chaque Testeur participant à une mission. 
•	Générer une nouvelle référence chaque jour pendant toute la durée de la mission. 
•	Associer chaque référence au chercheur et à la journée correspondante. 
•	Envoyer automatiquement la référence au chercheur. 
•	Afficher les instructions permettant au chercheur de retrouver l'emplacement où saisir la référence dans l'application à tester. 
•	Vérifiez automatiquement que la saisie de référence correspond à celle générée par la plateforme. 
•	Valider la journée lorsque la référence saisie est correcte. 
•	Enregistrer la validation de chaque journée dans le système. 
•	Signaler une référence incorrecte ou une journée non 
•	Générer une nouvelle référence pour le jour suivant. 
•	Suivre l'ensemble des validations quotidiennes jusqu'à la fin de la mission. 
•	Appliquer les conditions prévues dans le contrat en cas de journée non validée ou de mission incomplète.
6. Vérification
Le testeur récupère la référence et la saisie dans l'application concernée. La référence saisie
7. Validation
Si la référence correspond, l'étape est considérée comme validée.
Si la référence est incorrecte, l'étape n'est pas validée.
8. Gestion des jours non validés
Une mission nécessitant plusieurs jours
III. Conditions de paiement
•	Le montant de la mission est défini avant son commencement. 
•	Le testeur accepte les conditions de paiement dans le contrat. 
•	Le paiement intervient à la fin de la mission. 
•	La mission doit être entièrement accomplie conformément aux conditions prévues. 
•	Une mission non complétée peut entraîner l'annulation du paiement, conformément au contrat. 
IV. Besoins non fonctionnels
•	Sécurité : protection des comptes et des données. 
•	Fiabilité : assurer la bonne génération et validation des références. 
•	Performance : temps de réponse rapide. 
•	Ergonomie : interface simple et intuitive. 
•	Responsive : utilisation adaptée aux ordinateurs et smartphones. 
•	Scalabilité : possibilité d'ajouter de nouvelles missions 
•	Traçabilité : conservation de l'historique des validations et des missions. 
V. Architecture
La plateforme repose sur une architecture client-serveur :
Frontend : Next.js, React etc 
Backend : Symfony (API REST)
Base de données : MySQL


