// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'firebase_projects_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$projectsRepositoryHash() =>
    r'c31715f0710449e46e56cdad31dee83dc4ecefb7';

/// See also [projectsRepository].
@ProviderFor(projectsRepository)
final projectsRepositoryProvider =
    AutoDisposeProvider<ProjectsRepository>.internal(
  projectsRepository,
  name: r'projectsRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$projectsRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef ProjectsRepositoryRef = AutoDisposeProviderRef<ProjectsRepository>;
String _$getProjectsStreamHash() => r'55093fe521091567fd9314e0fc66384cbe56992c';

/// See also [getProjectsStream].
@ProviderFor(getProjectsStream)
final getProjectsStreamProvider = StreamProvider<List<Project>>.internal(
  getProjectsStream,
  name: r'getProjectsStreamProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$getProjectsStreamHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef GetProjectsStreamRef = StreamProviderRef<List<Project>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
