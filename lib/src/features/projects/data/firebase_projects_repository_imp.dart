import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';

class FirebaseProjectsRepositoryImp implements ProjectsRepository {
  static final _firestore = FirebaseFirestore.instance;
  static final _collection = _firestore.collection('Projects');

  @override
  Stream<List<Project>> getProjectsStream() {
    return _collection.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return Project.fromJson(doc.data()).copyWith(id: doc.id);
      }).toList();
    });
  }
}
