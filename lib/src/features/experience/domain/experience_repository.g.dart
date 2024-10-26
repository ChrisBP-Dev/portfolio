// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'experience_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$experienceRepositoryHash() =>
    r'7c2f19636ab899641a7e4d51dd6c17be927c09f7';

/// See also [experienceRepository].
@ProviderFor(experienceRepository)
final experienceRepositoryProvider =
    AutoDisposeProvider<ExperienceRepository>.internal(
  experienceRepository,
  name: r'experienceRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$experienceRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef ExperienceRepositoryRef = AutoDisposeProviderRef<ExperienceRepository>;
String _$getExperiencesStreamHash() =>
    r'e0ce4b703fbcea5ba13a784212b6620ac9d09e3c';

/// See also [getExperiencesStream].
@ProviderFor(getExperiencesStream)
final getExperiencesStreamProvider = StreamProvider<List<Experience>>.internal(
  getExperiencesStream,
  name: r'getExperiencesStreamProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$getExperiencesStreamHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef GetExperiencesStreamRef = StreamProviderRef<List<Experience>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
