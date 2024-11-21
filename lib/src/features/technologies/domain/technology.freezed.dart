// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'technology.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Technology _$TechnologyFromJson(Map<String, dynamic> json) {
  return _Technology.fromJson(json);
}

/// @nodoc
mixin _$Technology {
  String get name => throw _privateConstructorUsedError;
  ImageAndPath get image => throw _privateConstructorUsedError;
  String get id => throw _privateConstructorUsedError;
  String get experienceTime => throw _privateConstructorUsedError;

  /// Serializes this Technology to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TechnologyCopyWith<Technology> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TechnologyCopyWith<$Res> {
  factory $TechnologyCopyWith(
          Technology value, $Res Function(Technology) then) =
      _$TechnologyCopyWithImpl<$Res, Technology>;
  @useResult
  $Res call(
      {String name, ImageAndPath image, String id, String experienceTime});

  $ImageAndPathCopyWith<$Res> get image;
}

/// @nodoc
class _$TechnologyCopyWithImpl<$Res, $Val extends Technology>
    implements $TechnologyCopyWith<$Res> {
  _$TechnologyCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? image = null,
    Object? id = null,
    Object? experienceTime = null,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      image: null == image
          ? _value.image
          : image // ignore: cast_nullable_to_non_nullable
              as ImageAndPath,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      experienceTime: null == experienceTime
          ? _value.experienceTime
          : experienceTime // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ImageAndPathCopyWith<$Res> get image {
    return $ImageAndPathCopyWith<$Res>(_value.image, (value) {
      return _then(_value.copyWith(image: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TechnologyImplCopyWith<$Res>
    implements $TechnologyCopyWith<$Res> {
  factory _$$TechnologyImplCopyWith(
          _$TechnologyImpl value, $Res Function(_$TechnologyImpl) then) =
      __$$TechnologyImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name, ImageAndPath image, String id, String experienceTime});

  @override
  $ImageAndPathCopyWith<$Res> get image;
}

/// @nodoc
class __$$TechnologyImplCopyWithImpl<$Res>
    extends _$TechnologyCopyWithImpl<$Res, _$TechnologyImpl>
    implements _$$TechnologyImplCopyWith<$Res> {
  __$$TechnologyImplCopyWithImpl(
      _$TechnologyImpl _value, $Res Function(_$TechnologyImpl) _then)
      : super(_value, _then);

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? image = null,
    Object? id = null,
    Object? experienceTime = null,
  }) {
    return _then(_$TechnologyImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      image: null == image
          ? _value.image
          : image // ignore: cast_nullable_to_non_nullable
              as ImageAndPath,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      experienceTime: null == experienceTime
          ? _value.experienceTime
          : experienceTime // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$TechnologyImpl extends _Technology with DiagnosticableTreeMixin {
  const _$TechnologyImpl(
      {required this.name,
      required this.image,
      this.id = '',
      this.experienceTime = ''})
      : super._();

  factory _$TechnologyImpl.fromJson(Map<String, dynamic> json) =>
      _$$TechnologyImplFromJson(json);

  @override
  final String name;
  @override
  final ImageAndPath image;
  @override
  @JsonKey()
  final String id;
  @override
  @JsonKey()
  final String experienceTime;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Technology(name: $name, image: $image, id: $id, experienceTime: $experienceTime)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Technology'))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('image', image))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('experienceTime', experienceTime));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TechnologyImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.image, image) || other.image == image) &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.experienceTime, experienceTime) ||
                other.experienceTime == experienceTime));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, name, image, id, experienceTime);

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TechnologyImplCopyWith<_$TechnologyImpl> get copyWith =>
      __$$TechnologyImplCopyWithImpl<_$TechnologyImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TechnologyImplToJson(
      this,
    );
  }
}

abstract class _Technology extends Technology {
  const factory _Technology(
      {required final String name,
      required final ImageAndPath image,
      final String id,
      final String experienceTime}) = _$TechnologyImpl;
  const _Technology._() : super._();

  factory _Technology.fromJson(Map<String, dynamic> json) =
      _$TechnologyImpl.fromJson;

  @override
  String get name;
  @override
  ImageAndPath get image;
  @override
  String get id;
  @override
  String get experienceTime;

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TechnologyImplCopyWith<_$TechnologyImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
