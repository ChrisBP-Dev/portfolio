import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/domain/technology_repository.dart';

class FirebaseTechnologyRepositoryImp implements TechnologyRepository {
  const FirebaseTechnologyRepositoryImp({
    required this.firestoreService,
    required this.collectionName,
  });

  final FirestoreService<Technology> firestoreService;
  final String collectionName;

  @override
  Stream<List<Technology>> getAllTechnologies() {
    return firestoreService.getCollectionStream(
      collectionName,
      fromJson: Technology.fromJson,
    );
  }
}
