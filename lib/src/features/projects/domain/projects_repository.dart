// import 'package:portfolio/src/features/projects/data/fake_projects_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/projects/data/firebase_projects_repository_imp.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'projects_repository.g.dart';

abstract class ProjectsRepository {
  Stream<List<Project>> getProjectsStream();
}

// TODO(me): change this
@riverpod
String collectionProjectName(Ref ref) => 'projects';

@riverpod
ProjectsRepository projectsRepository(Ref ref) {
  return FirebaseProjectsRepositoryImp(
    firestoreService: ref.read(firestoreServiceProjectProvider),
    collectionName: ref.read(collectionProjectNameProvider),
  );
}

@Riverpod(keepAlive: true)
Stream<List<Project>> getProjectsStream(Ref ref) {
  return ref.read(projectsRepositoryProvider).getProjectsStream();
}
