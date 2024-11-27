// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_app.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$themeAppHash() => r'5194366b5e241c5299cf02f526b7f1a1d9b21974';

/// See also [themeApp].
@ProviderFor(themeApp)
final themeAppProvider = AutoDisposeProvider<ThemeApp>.internal(
  themeApp,
  name: r'themeAppProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$themeAppHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ThemeAppRef = AutoDisposeProviderRef<ThemeApp>;
String _$darkThemeHash() => r'dd41ba1881777937216107dc985407f40d85da37';

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

/// See also [darkTheme].
@ProviderFor(darkTheme)
const darkThemeProvider = DarkThemeFamily();

/// See also [darkTheme].
class DarkThemeFamily extends Family<ThemeData> {
  /// See also [darkTheme].
  const DarkThemeFamily();

  /// See also [darkTheme].
  DarkThemeProvider call(
    double screenWidth,
  ) {
    return DarkThemeProvider(
      screenWidth,
    );
  }

  @override
  DarkThemeProvider getProviderOverride(
    covariant DarkThemeProvider provider,
  ) {
    return call(
      provider.screenWidth,
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
  String? get name => r'darkThemeProvider';
}

/// See also [darkTheme].
class DarkThemeProvider extends AutoDisposeProvider<ThemeData> {
  /// See also [darkTheme].
  DarkThemeProvider(
    double screenWidth,
  ) : this._internal(
          (ref) => darkTheme(
            ref as DarkThemeRef,
            screenWidth,
          ),
          from: darkThemeProvider,
          name: r'darkThemeProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$darkThemeHash,
          dependencies: DarkThemeFamily._dependencies,
          allTransitiveDependencies: DarkThemeFamily._allTransitiveDependencies,
          screenWidth: screenWidth,
        );

  DarkThemeProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.screenWidth,
  }) : super.internal();

  final double screenWidth;

  @override
  Override overrideWith(
    ThemeData Function(DarkThemeRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: DarkThemeProvider._internal(
        (ref) => create(ref as DarkThemeRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        screenWidth: screenWidth,
      ),
    );
  }

  @override
  AutoDisposeProviderElement<ThemeData> createElement() {
    return _DarkThemeProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is DarkThemeProvider && other.screenWidth == screenWidth;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, screenWidth.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin DarkThemeRef on AutoDisposeProviderRef<ThemeData> {
  /// The parameter `screenWidth` of this provider.
  double get screenWidth;
}

class _DarkThemeProviderElement extends AutoDisposeProviderElement<ThemeData>
    with DarkThemeRef {
  _DarkThemeProviderElement(super.provider);

  @override
  double get screenWidth => (origin as DarkThemeProvider).screenWidth;
}

String _$lightThemeHash() => r'f89646aaf9031e8015bfaa3ffd3235d8f960c3d9';

/// See also [lightTheme].
@ProviderFor(lightTheme)
const lightThemeProvider = LightThemeFamily();

/// See also [lightTheme].
class LightThemeFamily extends Family<ThemeData> {
  /// See also [lightTheme].
  const LightThemeFamily();

  /// See also [lightTheme].
  LightThemeProvider call(
    double screenWidth,
  ) {
    return LightThemeProvider(
      screenWidth,
    );
  }

  @override
  LightThemeProvider getProviderOverride(
    covariant LightThemeProvider provider,
  ) {
    return call(
      provider.screenWidth,
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
  String? get name => r'lightThemeProvider';
}

/// See also [lightTheme].
class LightThemeProvider extends AutoDisposeProvider<ThemeData> {
  /// See also [lightTheme].
  LightThemeProvider(
    double screenWidth,
  ) : this._internal(
          (ref) => lightTheme(
            ref as LightThemeRef,
            screenWidth,
          ),
          from: lightThemeProvider,
          name: r'lightThemeProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$lightThemeHash,
          dependencies: LightThemeFamily._dependencies,
          allTransitiveDependencies:
              LightThemeFamily._allTransitiveDependencies,
          screenWidth: screenWidth,
        );

  LightThemeProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.screenWidth,
  }) : super.internal();

  final double screenWidth;

  @override
  Override overrideWith(
    ThemeData Function(LightThemeRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: LightThemeProvider._internal(
        (ref) => create(ref as LightThemeRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        screenWidth: screenWidth,
      ),
    );
  }

  @override
  AutoDisposeProviderElement<ThemeData> createElement() {
    return _LightThemeProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is LightThemeProvider && other.screenWidth == screenWidth;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, screenWidth.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin LightThemeRef on AutoDisposeProviderRef<ThemeData> {
  /// The parameter `screenWidth` of this provider.
  double get screenWidth;
}

class _LightThemeProviderElement extends AutoDisposeProviderElement<ThemeData>
    with LightThemeRef {
  _LightThemeProviderElement(super.provider);

  @override
  double get screenWidth => (origin as LightThemeProvider).screenWidth;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
