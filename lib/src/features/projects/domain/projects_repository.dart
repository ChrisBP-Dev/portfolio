import 'package:portfolio/src/features/projects/domain/project.dart';

abstract class ProjectsRepository {
  Stream<List<Project>> getProjectsStream();
  Future<void> createProject(Project project);
  Future<void> updateProject(Project project);
  Future<void> deleteProject(Project project);
}
