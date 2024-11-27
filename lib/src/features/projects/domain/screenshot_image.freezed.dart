// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'screenshot_image.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ImageAndPath _$ImageAndPathFromJson(Map<String, dynamic> json) {
  return _ImageAndPath.fromJson(json);
}

/// @nodoc
mixin _$ImageAndPath {
  String? get url => throw _privateConstructorUsedError;
  String? get localImage => throw _privateConstructorUsedError;
  String? get refPath => throw _privateConstructorUsedError;

  /// Serializes this ImageAndPath to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ImageAndPath
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ImageAndPathCopyWith<ImageAndPath> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ImageAndPathCopyWith<$Res> {
  factory $ImageAndPathCopyWith(
          ImageAndPath value, $Res Function(ImageAndPath) then) =
      _$ImageAndPathCopyWithImpl<$Res, ImageAndPath>;
  @useResult
  $Res call({String? url, String? localImage, String? refPath});
}

/// @nodoc
class _$ImageAndPathCopyWithImpl<$Res, $Val extends ImageAndPath>
    implements $ImageAndPathCopyWith<$Res> {
  _$ImageAndPathCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ImageAndPath
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? url = freezed,
    Object? localImage = freezed,
    Object? refPath = freezed,
  }) {
    return _then(_value.copyWith(
      url: freezed == url
          ? _value.url
          : url // ignore: cast_nullable_to_non_nullable
              as String?,
      localImage: freezed == localImage
          ? _value.localImage
          : localImage // ignore: cast_nullable_to_non_nullable
              as String?,
      refPath: freezed == refPath
          ? _value.refPath
          : refPath // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ImageAndPathImplCopyWith<$Res>
    implements $ImageAndPathCopyWith<$Res> {
  factory _$$ImageAndPathImplCopyWith(
          _$ImageAndPathImpl value, $Res Function(_$ImageAndPathImpl) then) =
      __$$ImageAndPathImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String? url, String? localImage, String? refPath});
}

/// @nodoc
class __$$ImageAndPathImplCopyWithImpl<$Res>
    extends _$ImageAndPathCopyWithImpl<$Res, _$ImageAndPathImpl>
    implements _$$ImageAndPathImplCopyWith<$Res> {
  __$$ImageAndPathImplCopyWithImpl(
      _$ImageAndPathImpl _value, $Res Function(_$ImageAndPathImpl) _then)
      : super(_value, _then);

  /// Create a copy of ImageAndPath
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? url = freezed,
    Object? localImage = freezed,
    Object? refPath = freezed,
  }) {
    return _then(_$ImageAndPathImpl(
      url: freezed == url
          ? _value.url
          : url // ignore: cast_nullable_to_non_nullable
              as String?,
      localImage: freezed == localImage
          ? _value.localImage
          : localImage // ignore: cast_nullable_to_non_nullable
              as String?,
      refPath: freezed == refPath
          ? _value.refPath
          : refPath // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ImageAndPathImpl extends _ImageAndPath with DiagnosticableTreeMixin {
  const _$ImageAndPathImpl({this.url, this.localImage, this.refPath})
      : super._();

  factory _$ImageAndPathImpl.fromJson(Map<String, dynamic> json) =>
      _$$ImageAndPathImplFromJson(json);

  @override
  final String? url;
  @override
  final String? localImage;
  @override
  final String? refPath;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'ImageAndPath(url: $url, localImage: $localImage, refPath: $refPath)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'ImageAndPath'))
      ..add(DiagnosticsProperty('url', url))
      ..add(DiagnosticsProperty('localImage', localImage))
      ..add(DiagnosticsProperty('refPath', refPath));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ImageAndPathImpl &&
            (identical(other.url, url) || other.url == url) &&
            (identical(other.localImage, localImage) ||
                other.localImage == localImage) &&
            (identical(other.refPath, refPath) || other.refPath == refPath));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, url, localImage, refPath);

  /// Create a copy of ImageAndPath
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ImageAndPathImplCopyWith<_$ImageAndPathImpl> get copyWith =>
      __$$ImageAndPathImplCopyWithImpl<_$ImageAndPathImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ImageAndPathImplToJson(
      this,
    );
  }
}

abstract class _ImageAndPath extends ImageAndPath {
  const factory _ImageAndPath(
      {final String? url,
      final String? localImage,
      final String? refPath}) = _$ImageAndPathImpl;
  const _ImageAndPath._() : super._();

  factory _ImageAndPath.fromJson(Map<String, dynamic> json) =
      _$ImageAndPathImpl.fromJson;

  @override
  String? get url;
  @override
  String? get localImage;
  @override
  String? get refPath;

  /// Create a copy of ImageAndPath
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ImageAndPathImplCopyWith<_$ImageAndPathImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
