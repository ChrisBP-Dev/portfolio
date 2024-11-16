// import 'package:flutter/foundation.dart';
// import 'package:portfolio/src/features/projects/domain/project.dart';
// import 'package:riverpod_annotation/riverpod_annotation.dart';
// part 'admin_create_project_form_controller.g.dart';

// @riverpod
// class AdminCreateProjectFormController
//     extends _$AdminCreateProjectFormController {
//   @override
//   Project build() {
//     return Project.initial();
//   }

//   void setCompanyNameEs(String companyNameEs) {
//     state = state.copyWith(companyNameEs: companyNameEs);
//   }

//   void setCompanyNameEn(String companyNameEn) {
//     state = state.copyWith(companyNameEn: companyNameEn);
//   }

//   void setShortDescriptionEs(String descriptionEs) {
//     state = state.copyWith(shortDescriptionEn: descriptionEs);
//   }

//   void setShortDescriptionEn(String descriptionEn) {
//     state = state.copyWith(shortDescriptionEn: descriptionEn);
//   }

//   void setMainImageUrl(Uint8List mainImageUrl) {
//     state = state.copyWith(
//       mainImageUrl: mainImageUrl.map(String.fromCharCode).join(),
//     );
//   }

//   void removeMainImageUrl() {
//     state = state.copyWith(mainImageUrl: '');
//   }

//   void addImageUrl(Uint8List imageUrl, int index) {
//     final images = List<String>.from(state.imagesUrls)
//       ..removeAt(index)
//       ..add(imageUrl.map(String.fromCharCode).join());
//     final isLast = index == state.imagesCharCodes.length - 1;

//     state = state.copyWith(
//       imagesUrls: isLast ? [...images, ''] : images,
//     );
//   }

//   void removeImageUrl(int index) {
//     final images = List<String>.from(state.imagesUrls)..removeAt(index);
//     state = state.copyWith(imagesUrls: images);
//   }

//   void addTechnology(TechnologyID technologyID) {
//     state = state.copyWith(technologies: [...state.technologies, technologyID]);
//   }

//   void removeTechnology(TechnologyID technologyID) {
//     state = state.copyWith(
//       technologies:
//           state.technologies.where((techID) => techID != technologyID).toList(),
//     );
//   }

//   void addFeatureEs(String featureES) {
//     state = state.copyWith(featuresEs: [...state.featuresEs, featureES]);
//   }

//   void removeFeatureEs(String featureES) {
//     state = state.copyWith(
//       featuresEs:
//           state.featuresEs.where((feature) => feature != featureES).toList(),
//     );
//   }

//   void addFeatureEn(String featureEN) {
//     state = state.copyWith(featuresEn: [...state.featuresEn, featureEN]);
//   }

//   void removeFeatureEn(String featureEN) {
//     state = state.copyWith(
//       featuresEn:
//           state.featuresEn.where((feature) => feature != featureEN).toList(),
//     );
//   }

//   void setWebsiteUrl(String websiteUrl) {
//     state = state.copyWith(websiteUrl: websiteUrl);
//   }

//   void setSourceCodeUrl(String sourceCodeUrl) {
//     state = state.copyWith(sourceCodeUrl: sourceCodeUrl);
//   }
// }
