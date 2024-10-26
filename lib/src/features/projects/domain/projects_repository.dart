// import 'package:portfolio/src/features/projects/data/fake_projects_repository.dart';
import 'package:portfolio/src/features/projects/data/firebase_projects_repository_imp.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'projects_repository.g.dart';

abstract class ProjectsRepository {
  Stream<List<Project>> getProjectsStream();
  Future<void> createProject(Project project);
  Future<void> updateProject(Project project);
  Future<void> deleteProject(Project project);
}

@riverpod
ProjectsRepository projectsRepository(ProjectsRepositoryRef ref) {
  // For testing purposes
  // return FakeProjectsRepository();
  // For production purposes
  return FirebaseProjectsRepositoryImp();
}

@Riverpod(keepAlive: true)
Stream<List<Project>> getProjectsStream(GetProjectsStreamRef ref) {
  return ref.read(projectsRepositoryProvider).getProjectsStream();
}
