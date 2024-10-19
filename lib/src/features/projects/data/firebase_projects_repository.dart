import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'firebase_projects_repository.g.dart';

class FirebaseProjectsRepository implements ProjectsRepository {
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

  @override
  Future<void> createProject(Project project) {
    return _collection.add(Project.toFirebase(project));
  }

  @override
  Future<void> deleteProject(Project project) {
    return _collection.doc(project.id).delete();
  }

  @override
  Future<void> updateProject(Project project) {
    return _collection.doc(project.id).update(project.toJson());
  }
}

@riverpod
ProjectsRepository projectsRepository(ProjectsRepositoryRef ref) {
  return FirebaseProjectsRepository();
}

@Riverpod(keepAlive: true)
Stream<List<Project>> getProjectsStream(GetProjectsStreamRef ref) {
  return ref.read(projectsRepositoryProvider).getProjectsStream();
}
