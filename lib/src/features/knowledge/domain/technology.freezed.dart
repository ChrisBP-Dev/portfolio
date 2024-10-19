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
  String get imageUrl => throw _privateConstructorUsedError;

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
  $Res call({String name, String imageUrl});
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
    Object? imageUrl = null,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      imageUrl: null == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
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
  $Res call({String name, String imageUrl});
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
    Object? imageUrl = null,
  }) {
    return _then(_$TechnologyImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      imageUrl: null == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TechnologyImpl implements _Technology {
  const _$TechnologyImpl({required this.name, required this.imageUrl});

  factory _$TechnologyImpl.fromJson(Map<String, dynamic> json) =>
      _$$TechnologyImplFromJson(json);

  @override
  final String name;
  @override
  final String imageUrl;

  @override
  String toString() {
    return 'Technology(name: $name, imageUrl: $imageUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TechnologyImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, name, imageUrl);

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

abstract class _Technology implements Technology {
  const factory _Technology(
      {required final String name,
      required final String imageUrl}) = _$TechnologyImpl;

  factory _Technology.fromJson(Map<String, dynamic> json) =
      _$TechnologyImpl.fromJson;

  @override
  String get name;
  @override
  String get imageUrl;

  /// Create a copy of Technology
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TechnologyImplCopyWith<_$TechnologyImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
