import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/projects/data/admin/firebase_admin_projects_repository_imp.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'admin_projects_repository.g.dart';

abstract class AdminProjectsRepository extends ProjectsRepository {
  Future<void> createProject(Project project);
  Future<void> deleteProject(Project project);
  Future<Project> updateProject(Project project);
}

@riverpod
AdminProjectsRepository adminProjectsRepository(
  Ref ref,
) {
  return FirebaseAdminProjectsRepositoryImp();
}

@Riverpod(keepAlive: true)
Stream<List<Project>> getAdminProjectsStream(Ref ref) {
  return ref.read(adminProjectsRepositoryProvider).getProjectsStream();
}
