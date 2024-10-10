// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'text_theme.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$appTextThemeHash() => r'df67689e6801bf171141801635599ec0b844b0a4';

/// See also [appTextTheme].
@ProviderFor(appTextTheme)
final appTextThemeProvider = AutoDisposeProvider<AppTextTheme>.internal(
  appTextTheme,
  name: r'appTextThemeProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$appTextThemeHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef AppTextThemeRef = AutoDisposeProviderRef<AppTextTheme>;
String _$lightTextThemeHash() => r'235b7e4df534296b8c10f3b11fba6f2e6c5d2e31';

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

/// See also [lightTextTheme].
@ProviderFor(lightTextTheme)
const lightTextThemeProvider = LightTextThemeFamily();

/// See also [lightTextTheme].
class LightTextThemeFamily extends Family<TextTheme> {
  /// See also [lightTextTheme].
  const LightTextThemeFamily();

  /// See also [lightTextTheme].
  LightTextThemeProvider call(
    double screenWidth,
  ) {
    return LightTextThemeProvider(
      screenWidth,
    );
  }

  @override
  LightTextThemeProvider getProviderOverride(
    covariant LightTextThemeProvider provider,
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
  String? get name => r'lightTextThemeProvider';
}

/// See also [lightTextTheme].
class LightTextThemeProvider extends AutoDisposeProvider<TextTheme> {
  /// See also [lightTextTheme].
  LightTextThemeProvider(
    double screenWidth,
  ) : this._internal(
          (ref) => lightTextTheme(
            ref as LightTextThemeRef,
            screenWidth,
          ),
          from: lightTextThemeProvider,
          name: r'lightTextThemeProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$lightTextThemeHash,
          dependencies: LightTextThemeFamily._dependencies,
          allTransitiveDependencies:
              LightTextThemeFamily._allTransitiveDependencies,
          screenWidth: screenWidth,
        );

  LightTextThemeProvider._internal(
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
    TextTheme Function(LightTextThemeRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: LightTextThemeProvider._internal(
        (ref) => create(ref as LightTextThemeRef),
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
  AutoDisposeProviderElement<TextTheme> createElement() {
    return _LightTextThemeProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is LightTextThemeProvider && other.screenWidth == screenWidth;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, screenWidth.hashCode);

    return _SystemHash.finish(hash);
  }
}

mixin LightTextThemeRef on AutoDisposeProviderRef<TextTheme> {
  /// The parameter `screenWidth` of this provider.
  double get screenWidth;
}

class _LightTextThemeProviderElement
    extends AutoDisposeProviderElement<TextTheme> with LightTextThemeRef {
  _LightTextThemeProviderElement(super.provider);

  @override
  double get screenWidth => (origin as LightTextThemeProvider).screenWidth;
}

String _$darkTextThemeHash() => r'41239cc9aaf36004145de55285086d814444445b';

/// See also [darkTextTheme].
@ProviderFor(darkTextTheme)
const darkTextThemeProvider = DarkTextThemeFamily();

/// See also [darkTextTheme].
class DarkTextThemeFamily extends Family<TextTheme> {
  /// See also [darkTextTheme].
  const DarkTextThemeFamily();

  /// See also [darkTextTheme].
  DarkTextThemeProvider call(
    double screenWidth,
  ) {
    return DarkTextThemeProvider(
      screenWidth,
    );
  }

  @override
  DarkTextThemeProvider getProviderOverride(
    covariant DarkTextThemeProvider provider,
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
  String? get name => r'darkTextThemeProvider';
}

/// See also [darkTextTheme].
class DarkTextThemeProvider extends AutoDisposeProvider<TextTheme> {
  /// See also [darkTextTheme].
  DarkTextThemeProvider(
    double screenWidth,
  ) : this._internal(
          (ref) => darkTextTheme(
            ref as DarkTextThemeRef,
            screenWidth,
          ),
          from: darkTextThemeProvider,
          name: r'darkTextThemeProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$darkTextThemeHash,
          dependencies: DarkTextThemeFamily._dependencies,
          allTransitiveDependencies:
              DarkTextThemeFamily._allTransitiveDependencies,
          screenWidth: screenWidth,
        );

  DarkTextThemeProvider._internal(
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
    TextTheme Function(DarkTextThemeRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: DarkTextThemeProvider._internal(
        (ref) => create(ref as DarkTextThemeRef),
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
  AutoDisposeProviderElement<TextTheme> createElement() {
    return _DarkTextThemeProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is DarkTextThemeProvider && other.screenWidth == screenWidth;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, screenWidth.hashCode);

    return _SystemHash.finish(hash);
  }
}

mixin DarkTextThemeRef on AutoDisposeProviderRef<TextTheme> {
  /// The parameter `screenWidth` of this provider.
  double get screenWidth;
}

class _DarkTextThemeProviderElement
    extends AutoDisposeProviderElement<TextTheme> with DarkTextThemeRef {
  _DarkTextThemeProviderElement(super.provider);

  @override
  double get screenWidth => (origin as DarkTextThemeProvider).screenWidth;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
