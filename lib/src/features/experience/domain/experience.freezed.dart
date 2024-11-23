// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'experience.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Experience _$ExperienceFromJson(Map<String, dynamic> json) {
  return _Experience.fromJson(json);
}

/// @nodoc
mixin _$Experience {
  String get id => throw _privateConstructorUsedError;
  String get date => throw _privateConstructorUsedError;
  String get companyName => throw _privateConstructorUsedError;
  String get jobNameEn => throw _privateConstructorUsedError;
  String get jobNameEs => throw _privateConstructorUsedError;
  List<String> get responsabilitiesEn => throw _privateConstructorUsedError;
  List<String> get responsabilitiesEs => throw _privateConstructorUsedError;

  /// Serializes this Experience to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Experience
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ExperienceCopyWith<Experience> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ExperienceCopyWith<$Res> {
  factory $ExperienceCopyWith(
          Experience value, $Res Function(Experience) then) =
      _$ExperienceCopyWithImpl<$Res, Experience>;
  @useResult
  $Res call(
      {String id,
      String date,
      String companyName,
      String jobNameEn,
      String jobNameEs,
      List<String> responsabilitiesEn,
      List<String> responsabilitiesEs});
}

/// @nodoc
class _$ExperienceCopyWithImpl<$Res, $Val extends Experience>
    implements $ExperienceCopyWith<$Res> {
  _$ExperienceCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Experience
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? companyName = null,
    Object? jobNameEn = null,
    Object? jobNameEs = null,
    Object? responsabilitiesEn = null,
    Object? responsabilitiesEs = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      companyName: null == companyName
          ? _value.companyName
          : companyName // ignore: cast_nullable_to_non_nullable
              as String,
      jobNameEn: null == jobNameEn
          ? _value.jobNameEn
          : jobNameEn // ignore: cast_nullable_to_non_nullable
              as String,
      jobNameEs: null == jobNameEs
          ? _value.jobNameEs
          : jobNameEs // ignore: cast_nullable_to_non_nullable
              as String,
      responsabilitiesEn: null == responsabilitiesEn
          ? _value.responsabilitiesEn
          : responsabilitiesEn // ignore: cast_nullable_to_non_nullable
              as List<String>,
      responsabilitiesEs: null == responsabilitiesEs
          ? _value.responsabilitiesEs
          : responsabilitiesEs // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ExperienceImplCopyWith<$Res>
    implements $ExperienceCopyWith<$Res> {
  factory _$$ExperienceImplCopyWith(
          _$ExperienceImpl value, $Res Function(_$ExperienceImpl) then) =
      __$$ExperienceImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String date,
      String companyName,
      String jobNameEn,
      String jobNameEs,
      List<String> responsabilitiesEn,
      List<String> responsabilitiesEs});
}

/// @nodoc
class __$$ExperienceImplCopyWithImpl<$Res>
    extends _$ExperienceCopyWithImpl<$Res, _$ExperienceImpl>
    implements _$$ExperienceImplCopyWith<$Res> {
  __$$ExperienceImplCopyWithImpl(
      _$ExperienceImpl _value, $Res Function(_$ExperienceImpl) _then)
      : super(_value, _then);

  /// Create a copy of Experience
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? companyName = null,
    Object? jobNameEn = null,
    Object? jobNameEs = null,
    Object? responsabilitiesEn = null,
    Object? responsabilitiesEs = null,
  }) {
    return _then(_$ExperienceImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      companyName: null == companyName
          ? _value.companyName
          : companyName // ignore: cast_nullable_to_non_nullable
              as String,
      jobNameEn: null == jobNameEn
          ? _value.jobNameEn
          : jobNameEn // ignore: cast_nullable_to_non_nullable
              as String,
      jobNameEs: null == jobNameEs
          ? _value.jobNameEs
          : jobNameEs // ignore: cast_nullable_to_non_nullable
              as String,
      responsabilitiesEn: null == responsabilitiesEn
          ? _value._responsabilitiesEn
          : responsabilitiesEn // ignore: cast_nullable_to_non_nullable
              as List<String>,
      responsabilitiesEs: null == responsabilitiesEs
          ? _value._responsabilitiesEs
          : responsabilitiesEs // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ExperienceImpl implements _Experience {
  const _$ExperienceImpl(
      {required this.id,
      required this.date,
      required this.companyName,
      required this.jobNameEn,
      required this.jobNameEs,
      required final List<String> responsabilitiesEn,
      required final List<String> responsabilitiesEs})
      : _responsabilitiesEn = responsabilitiesEn,
        _responsabilitiesEs = responsabilitiesEs;

  factory _$ExperienceImpl.fromJson(Map<String, dynamic> json) =>
      _$$ExperienceImplFromJson(json);

  @override
  final String id;
  @override
  final String date;
  @override
  final String companyName;
  @override
  final String jobNameEn;
  @override
  final String jobNameEs;
  final List<String> _responsabilitiesEn;
  @override
  List<String> get responsabilitiesEn {
    if (_responsabilitiesEn is EqualUnmodifiableListView)
      return _responsabilitiesEn;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_responsabilitiesEn);
  }

  final List<String> _responsabilitiesEs;
  @override
  List<String> get responsabilitiesEs {
    if (_responsabilitiesEs is EqualUnmodifiableListView)
      return _responsabilitiesEs;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_responsabilitiesEs);
  }

  @override
  String toString() {
    return 'Experience(id: $id, date: $date, companyName: $companyName, jobNameEn: $jobNameEn, jobNameEs: $jobNameEs, responsabilitiesEn: $responsabilitiesEn, responsabilitiesEs: $responsabilitiesEs)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ExperienceImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.companyName, companyName) ||
                other.companyName == companyName) &&
            (identical(other.jobNameEn, jobNameEn) ||
                other.jobNameEn == jobNameEn) &&
            (identical(other.jobNameEs, jobNameEs) ||
                other.jobNameEs == jobNameEs) &&
            const DeepCollectionEquality()
                .equals(other._responsabilitiesEn, _responsabilitiesEn) &&
            const DeepCollectionEquality()
                .equals(other._responsabilitiesEs, _responsabilitiesEs));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      date,
      companyName,
      jobNameEn,
      jobNameEs,
      const DeepCollectionEquality().hash(_responsabilitiesEn),
      const DeepCollectionEquality().hash(_responsabilitiesEs));

  /// Create a copy of Experience
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ExperienceImplCopyWith<_$ExperienceImpl> get copyWith =>
      __$$ExperienceImplCopyWithImpl<_$ExperienceImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ExperienceImplToJson(
      this,
    );
  }
}

abstract class _Experience implements Experience {
  const factory _Experience(
      {required final String id,
      required final String date,
      required final String companyName,
      required final String jobNameEn,
      required final String jobNameEs,
      required final List<String> responsabilitiesEn,
      required final List<String> responsabilitiesEs}) = _$ExperienceImpl;

  factory _Experience.fromJson(Map<String, dynamic> json) =
      _$ExperienceImpl.fromJson;

  @override
  String get id;
  @override
  String get date;
  @override
  String get companyName;
  @override
  String get jobNameEn;
  @override
  String get jobNameEs;
  @override
  List<String> get responsabilitiesEn;
  @override
  List<String> get responsabilitiesEs;

  /// Create a copy of Experience
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ExperienceImplCopyWith<_$ExperienceImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
