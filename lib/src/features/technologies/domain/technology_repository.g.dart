// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'technology_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$collectionTechnologyNameHash() =>
    r'549067487a462de00fec0324624e3998507b7f27';

/// See also [collectionTechnologyName].
@ProviderFor(collectionTechnologyName)
final collectionTechnologyNameProvider = AutoDisposeProvider<String>.internal(
  collectionTechnologyName,
  name: r'collectionTechnologyNameProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$collectionTechnologyNameHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef CollectionTechnologyNameRef = AutoDisposeProviderRef<String>;
String _$technologyRepositoryHash() =>
    r'c73467bc9d57980bc1362ccb06028891608e1a67';

/// See also [technologyRepository].
@ProviderFor(technologyRepository)
final technologyRepositoryProvider =
    AutoDisposeProvider<TechnologyRepository>.internal(
  technologyRepository,
  name: r'technologyRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$technologyRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TechnologyRepositoryRef = AutoDisposeProviderRef<TechnologyRepository>;
String _$getTechnologiesHash() => r'242fc6d310c2bc407089c38abfff3d49621bdea0';

/// See also [getTechnologies].
@ProviderFor(getTechnologies)
final getTechnologiesProvider = StreamProvider<List<Technology>>.internal(
  getTechnologies,
  name: r'getTechnologiesProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$getTechnologiesHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef GetTechnologiesRef = StreamProviderRef<List<Technology>>;
String _$getTechnologiesByIdHash() =>
    r'7294930540fd441b4f0d1423ed561cfd6448ffea';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [getTechnologiesById].
@ProviderFor(getTechnologiesById)
const getTechnologiesByIdProvider = GetTechnologiesByIdFamily();

/// See also [getTechnologiesById].
class GetTechnologiesByIdFamily extends Family<AsyncValue<List<Technology>>> {
  /// See also [getTechnologiesById].
  const GetTechnologiesByIdFamily();

  /// See also [getTechnologiesById].
  GetTechnologiesByIdProvider call(
    List<String> ids,
  ) {
    return GetTechnologiesByIdProvider(
      ids,
    );
  }

  @override
  GetTechnologiesByIdProvider getProviderOverride(
    covariant GetTechnologiesByIdProvider provider,
  ) {
    return call(
      provider.ids,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'getTechnologiesByIdProvider';
}

/// See also [getTechnologiesById].
class GetTechnologiesByIdProvider extends StreamProvider<List<Technology>> {
  /// See also [getTechnologiesById].
  GetTechnologiesByIdProvider(
    List<String> ids,
  ) : this._internal(
          (ref) => getTechnologiesById(
            ref as GetTechnologiesByIdRef,
            ids,
          ),
          from: getTechnologiesByIdProvider,
          name: r'getTechnologiesByIdProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$getTechnologiesByIdHash,
          dependencies: GetTechnologiesByIdFamily._dependencies,
          allTransitiveDependencies:
              GetTechnologiesByIdFamily._allTransitiveDependencies,
          ids: ids,
        );

  GetTechnologiesByIdProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.ids,
  }) : super.internal();

  final List<String> ids;

  @override
  Override overrideWith(
    Stream<List<Technology>> Function(GetTechnologiesByIdRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: GetTechnologiesByIdProvider._internal(
        (ref) => create(ref as GetTechnologiesByIdRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        ids: ids,
      ),
    );
  }

  @override
  StreamProviderElement<List<Technology>> createElement() {
    return _GetTechnologiesByIdProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is GetTechnologiesByIdProvider && other.ids == ids;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, ids.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin GetTechnologiesByIdRef on StreamProviderRef<List<Technology>> {
  /// The parameter `ids` of this provider.
  List<String> get ids;
}

class _GetTechnologiesByIdProviderElement
    extends StreamProviderElement<List<Technology>>
    with GetTechnologiesByIdRef {
  _GetTechnologiesByIdProviderElement(super.provider);

  @override
  List<String> get ids => (origin as GetTechnologiesByIdProvider).ids;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
