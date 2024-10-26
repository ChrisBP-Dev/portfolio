import 'dart:async';
import 'package:portfolio/src/core/constants/projects.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';

class FakeProjectsRepositoryImp implements ProjectsRepository {
  final List<Project> _projects = kProjects;

  @override
  Stream<List<Project>> getProjectsStream() {
    return Stream.value(_projects);
  }

  @override
  Future<void> createProject(Project project) async {
    _projects.add(project);
  }

  @override
  Future<void> updateProject(Project project) async {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index != -1) {
      _projects[index] = project;
    }
  }

  @override
  Future<void> deleteProject(Project project) async {
    _projects.removeWhere((p) => p.id == project.id);
  }
}
