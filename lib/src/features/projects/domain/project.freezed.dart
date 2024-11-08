// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'project.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Project _$ProjectFromJson(Map<String, dynamic> json) {
  return _Project.fromJson(json);
}

/// @nodoc
mixin _$Project {
  String get companyNameEs => throw _privateConstructorUsedError;
  String get companyNameEn => throw _privateConstructorUsedError;
  String get shortDescriptionEs => throw _privateConstructorUsedError;
  String get shortDescriptionEn => throw _privateConstructorUsedError;
  String get mainImageUrl => throw _privateConstructorUsedError;
  String? get refMainImage => throw _privateConstructorUsedError;
  String get id => throw _privateConstructorUsedError;
  List<String> get imagesUrls => throw _privateConstructorUsedError;
  List<String> get refImagesUrls =>
      throw _privateConstructorUsedError; // @JsonKey(name: Project.technologiesKey)
  List<Technology> get technologies => throw _privateConstructorUsedError;
  List<String> get featuresEs => throw _privateConstructorUsedError;
  List<String> get featuresEn => throw _privateConstructorUsedError;
  String? get websiteUrl => throw _privateConstructorUsedError;
  String? get sourceCodeUrl => throw _privateConstructorUsedError;

  /// Serializes this Project to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Project
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectCopyWith<Project> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectCopyWith<$Res> {
  factory $ProjectCopyWith(Project value, $Res Function(Project) then) =
      _$ProjectCopyWithImpl<$Res, Project>;
  @useResult
  $Res call(
      {String companyNameEs,
      String companyNameEn,
      String shortDescriptionEs,
      String shortDescriptionEn,
      String mainImageUrl,
      String? refMainImage,
      String id,
      List<String> imagesUrls,
      List<String> refImagesUrls,
      List<Technology> technologies,
      List<String> featuresEs,
      List<String> featuresEn,
      String? websiteUrl,
      String? sourceCodeUrl});
}

/// @nodoc
class _$ProjectCopyWithImpl<$Res, $Val extends Project>
    implements $ProjectCopyWith<$Res> {
  _$ProjectCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Project
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? companyNameEs = null,
    Object? companyNameEn = null,
    Object? shortDescriptionEs = null,
    Object? shortDescriptionEn = null,
    Object? mainImageUrl = null,
    Object? refMainImage = freezed,
    Object? id = null,
    Object? imagesUrls = null,
    Object? refImagesUrls = null,
    Object? technologies = null,
    Object? featuresEs = null,
    Object? featuresEn = null,
    Object? websiteUrl = freezed,
    Object? sourceCodeUrl = freezed,
  }) {
    return _then(_value.copyWith(
      companyNameEs: null == companyNameEs
          ? _value.companyNameEs
          : companyNameEs // ignore: cast_nullable_to_non_nullable
              as String,
      companyNameEn: null == companyNameEn
          ? _value.companyNameEn
          : companyNameEn // ignore: cast_nullable_to_non_nullable
              as String,
      shortDescriptionEs: null == shortDescriptionEs
          ? _value.shortDescriptionEs
          : shortDescriptionEs // ignore: cast_nullable_to_non_nullable
              as String,
      shortDescriptionEn: null == shortDescriptionEn
          ? _value.shortDescriptionEn
          : shortDescriptionEn // ignore: cast_nullable_to_non_nullable
              as String,
      mainImageUrl: null == mainImageUrl
          ? _value.mainImageUrl
          : mainImageUrl // ignore: cast_nullable_to_non_nullable
              as String,
      refMainImage: freezed == refMainImage
          ? _value.refMainImage
          : refMainImage // ignore: cast_nullable_to_non_nullable
              as String?,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      imagesUrls: null == imagesUrls
          ? _value.imagesUrls
          : imagesUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      refImagesUrls: null == refImagesUrls
          ? _value.refImagesUrls
          : refImagesUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      technologies: null == technologies
          ? _value.technologies
          : technologies // ignore: cast_nullable_to_non_nullable
              as List<Technology>,
      featuresEs: null == featuresEs
          ? _value.featuresEs
          : featuresEs // ignore: cast_nullable_to_non_nullable
              as List<String>,
      featuresEn: null == featuresEn
          ? _value.featuresEn
          : featuresEn // ignore: cast_nullable_to_non_nullable
              as List<String>,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      sourceCodeUrl: freezed == sourceCodeUrl
          ? _value.sourceCodeUrl
          : sourceCodeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ProjectImplCopyWith<$Res> implements $ProjectCopyWith<$Res> {
  factory _$$ProjectImplCopyWith(
          _$ProjectImpl value, $Res Function(_$ProjectImpl) then) =
      __$$ProjectImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String companyNameEs,
      String companyNameEn,
      String shortDescriptionEs,
      String shortDescriptionEn,
      String mainImageUrl,
      String? refMainImage,
      String id,
      List<String> imagesUrls,
      List<String> refImagesUrls,
      List<Technology> technologies,
      List<String> featuresEs,
      List<String> featuresEn,
      String? websiteUrl,
      String? sourceCodeUrl});
}

/// @nodoc
class __$$ProjectImplCopyWithImpl<$Res>
    extends _$ProjectCopyWithImpl<$Res, _$ProjectImpl>
    implements _$$ProjectImplCopyWith<$Res> {
  __$$ProjectImplCopyWithImpl(
      _$ProjectImpl _value, $Res Function(_$ProjectImpl) _then)
      : super(_value, _then);

  /// Create a copy of Project
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? companyNameEs = null,
    Object? companyNameEn = null,
    Object? shortDescriptionEs = null,
    Object? shortDescriptionEn = null,
    Object? mainImageUrl = null,
    Object? refMainImage = freezed,
    Object? id = null,
    Object? imagesUrls = null,
    Object? refImagesUrls = null,
    Object? technologies = null,
    Object? featuresEs = null,
    Object? featuresEn = null,
    Object? websiteUrl = freezed,
    Object? sourceCodeUrl = freezed,
  }) {
    return _then(_$ProjectImpl(
      companyNameEs: null == companyNameEs
          ? _value.companyNameEs
          : companyNameEs // ignore: cast_nullable_to_non_nullable
              as String,
      companyNameEn: null == companyNameEn
          ? _value.companyNameEn
          : companyNameEn // ignore: cast_nullable_to_non_nullable
              as String,
      shortDescriptionEs: null == shortDescriptionEs
          ? _value.shortDescriptionEs
          : shortDescriptionEs // ignore: cast_nullable_to_non_nullable
              as String,
      shortDescriptionEn: null == shortDescriptionEn
          ? _value.shortDescriptionEn
          : shortDescriptionEn // ignore: cast_nullable_to_non_nullable
              as String,
      mainImageUrl: null == mainImageUrl
          ? _value.mainImageUrl
          : mainImageUrl // ignore: cast_nullable_to_non_nullable
              as String,
      refMainImage: freezed == refMainImage
          ? _value.refMainImage
          : refMainImage // ignore: cast_nullable_to_non_nullable
              as String?,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      imagesUrls: null == imagesUrls
          ? _value._imagesUrls
          : imagesUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      refImagesUrls: null == refImagesUrls
          ? _value._refImagesUrls
          : refImagesUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      technologies: null == technologies
          ? _value._technologies
          : technologies // ignore: cast_nullable_to_non_nullable
              as List<Technology>,
      featuresEs: null == featuresEs
          ? _value._featuresEs
          : featuresEs // ignore: cast_nullable_to_non_nullable
              as List<String>,
      featuresEn: null == featuresEn
          ? _value._featuresEn
          : featuresEn // ignore: cast_nullable_to_non_nullable
              as List<String>,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      sourceCodeUrl: freezed == sourceCodeUrl
          ? _value.sourceCodeUrl
          : sourceCodeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ProjectImpl extends _Project with DiagnosticableTreeMixin {
  const _$ProjectImpl(
      {required this.companyNameEs,
      required this.companyNameEn,
      required this.shortDescriptionEs,
      required this.shortDescriptionEn,
      required this.mainImageUrl,
      this.refMainImage,
      this.id = '',
      final List<String> imagesUrls = const <String>[],
      final List<String> refImagesUrls = const <String>[],
      final List<Technology> technologies = const <Technology>[],
      final List<String> featuresEs = const <String>[],
      final List<String> featuresEn = const <String>[],
      this.websiteUrl,
      this.sourceCodeUrl})
      : _imagesUrls = imagesUrls,
        _refImagesUrls = refImagesUrls,
        _technologies = technologies,
        _featuresEs = featuresEs,
        _featuresEn = featuresEn,
        super._();

  factory _$ProjectImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectImplFromJson(json);

  @override
  final String companyNameEs;
  @override
  final String companyNameEn;
  @override
  final String shortDescriptionEs;
  @override
  final String shortDescriptionEn;
  @override
  final String mainImageUrl;
  @override
  final String? refMainImage;
  @override
  @JsonKey()
  final String id;
  final List<String> _imagesUrls;
  @override
  @JsonKey()
  List<String> get imagesUrls {
    if (_imagesUrls is EqualUnmodifiableListView) return _imagesUrls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_imagesUrls);
  }

  final List<String> _refImagesUrls;
  @override
  @JsonKey()
  List<String> get refImagesUrls {
    if (_refImagesUrls is EqualUnmodifiableListView) return _refImagesUrls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_refImagesUrls);
  }

// @JsonKey(name: Project.technologiesKey)
  final List<Technology> _technologies;
// @JsonKey(name: Project.technologiesKey)
  @override
  @JsonKey()
  List<Technology> get technologies {
    if (_technologies is EqualUnmodifiableListView) return _technologies;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_technologies);
  }

  final List<String> _featuresEs;
  @override
  @JsonKey()
  List<String> get featuresEs {
    if (_featuresEs is EqualUnmodifiableListView) return _featuresEs;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_featuresEs);
  }

  final List<String> _featuresEn;
  @override
  @JsonKey()
  List<String> get featuresEn {
    if (_featuresEn is EqualUnmodifiableListView) return _featuresEn;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_featuresEn);
  }

  @override
  final String? websiteUrl;
  @override
  final String? sourceCodeUrl;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Project(companyNameEs: $companyNameEs, companyNameEn: $companyNameEn, shortDescriptionEs: $shortDescriptionEs, shortDescriptionEn: $shortDescriptionEn, mainImageUrl: $mainImageUrl, refMainImage: $refMainImage, id: $id, imagesUrls: $imagesUrls, refImagesUrls: $refImagesUrls, technologies: $technologies, featuresEs: $featuresEs, featuresEn: $featuresEn, websiteUrl: $websiteUrl, sourceCodeUrl: $sourceCodeUrl)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Project'))
      ..add(DiagnosticsProperty('companyNameEs', companyNameEs))
      ..add(DiagnosticsProperty('companyNameEn', companyNameEn))
      ..add(DiagnosticsProperty('shortDescriptionEs', shortDescriptionEs))
      ..add(DiagnosticsProperty('shortDescriptionEn', shortDescriptionEn))
      ..add(DiagnosticsProperty('mainImageUrl', mainImageUrl))
      ..add(DiagnosticsProperty('refMainImage', refMainImage))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('imagesUrls', imagesUrls))
      ..add(DiagnosticsProperty('refImagesUrls', refImagesUrls))
      ..add(DiagnosticsProperty('technologies', technologies))
      ..add(DiagnosticsProperty('featuresEs', featuresEs))
      ..add(DiagnosticsProperty('featuresEn', featuresEn))
      ..add(DiagnosticsProperty('websiteUrl', websiteUrl))
      ..add(DiagnosticsProperty('sourceCodeUrl', sourceCodeUrl));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectImpl &&
            (identical(other.companyNameEs, companyNameEs) ||
                other.companyNameEs == companyNameEs) &&
            (identical(other.companyNameEn, companyNameEn) ||
                other.companyNameEn == companyNameEn) &&
            (identical(other.shortDescriptionEs, shortDescriptionEs) ||
                other.shortDescriptionEs == shortDescriptionEs) &&
            (identical(other.shortDescriptionEn, shortDescriptionEn) ||
                other.shortDescriptionEn == shortDescriptionEn) &&
            (identical(other.mainImageUrl, mainImageUrl) ||
                other.mainImageUrl == mainImageUrl) &&
            (identical(other.refMainImage, refMainImage) ||
                other.refMainImage == refMainImage) &&
            (identical(other.id, id) || other.id == id) &&
            const DeepCollectionEquality()
                .equals(other._imagesUrls, _imagesUrls) &&
            const DeepCollectionEquality()
                .equals(other._refImagesUrls, _refImagesUrls) &&
            const DeepCollectionEquality()
                .equals(other._technologies, _technologies) &&
            const DeepCollectionEquality()
                .equals(other._featuresEs, _featuresEs) &&
            const DeepCollectionEquality()
                .equals(other._featuresEn, _featuresEn) &&
            (identical(other.websiteUrl, websiteUrl) ||
                other.websiteUrl == websiteUrl) &&
            (identical(other.sourceCodeUrl, sourceCodeUrl) ||
                other.sourceCodeUrl == sourceCodeUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      companyNameEs,
      companyNameEn,
      shortDescriptionEs,
      shortDescriptionEn,
      mainImageUrl,
      refMainImage,
      id,
      const DeepCollectionEquality().hash(_imagesUrls),
      const DeepCollectionEquality().hash(_refImagesUrls),
      const DeepCollectionEquality().hash(_technologies),
      const DeepCollectionEquality().hash(_featuresEs),
      const DeepCollectionEquality().hash(_featuresEn),
      websiteUrl,
      sourceCodeUrl);

  /// Create a copy of Project
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectImplCopyWith<_$ProjectImpl> get copyWith =>
      __$$ProjectImplCopyWithImpl<_$ProjectImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectImplToJson(
      this,
    );
  }
}

abstract class _Project extends Project {
  const factory _Project(
      {required final String companyNameEs,
      required final String companyNameEn,
      required final String shortDescriptionEs,
      required final String shortDescriptionEn,
      required final String mainImageUrl,
      final String? refMainImage,
      final String id,
      final List<String> imagesUrls,
      final List<String> refImagesUrls,
      final List<Technology> technologies,
      final List<String> featuresEs,
      final List<String> featuresEn,
      final String? websiteUrl,
      final String? sourceCodeUrl}) = _$ProjectImpl;
  const _Project._() : super._();

  factory _Project.fromJson(Map<String, dynamic> json) = _$ProjectImpl.fromJson;

  @override
  String get companyNameEs;
  @override
  String get companyNameEn;
  @override
  String get shortDescriptionEs;
  @override
  String get shortDescriptionEn;
  @override
  String get mainImageUrl;
  @override
  String? get refMainImage;
  @override
  String get id;
  @override
  List<String> get imagesUrls;
  @override
  List<String> get refImagesUrls; // @JsonKey(name: Project.technologiesKey)
  @override
  List<Technology> get technologies;
  @override
  List<String> get featuresEs;
  @override
  List<String> get featuresEn;
  @override
  String? get websiteUrl;
  @override
  String? get sourceCodeUrl;

  /// Create a copy of Project
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectImplCopyWith<_$ProjectImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
