import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';

class FirebaseProjectsRepositoryImp implements ProjectsRepository {
  FirebaseProjectsRepositoryImp({
    required this.firestoreService,
    required this.collectionName,
  });
  final FirestoreService<Project> firestoreService;
  final String collectionName;

  @override
  Stream<List<Project>> getProjectsStream() {
    return firestoreService.getCollectionStream(
      collectionName,
      fromJson: Project.fromJson,
    );
  }
}
