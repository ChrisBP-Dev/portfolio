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
}
